import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { ReportService } from '../services/reportService';
import { ReportDataService } from '../services/reportDataService';
import { PDFGenerationService } from '../services/pdfGenerationService';
import { NotificationService } from '../services/notificationService';
import { UserService } from '../services/userService';
import logger from '../utils/logger';

// Lazy-load services to avoid database initialization errors
const getReportService = () => new ReportService();
const getReportDataService = () => new ReportDataService();
const getPdfService = () => new PDFGenerationService();
const getNotificationService = () => new NotificationService();
const getUserService = () => new UserService();

export const generateFormalReport = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Validate user role
    if (user.role !== 'finance') {
      return res.status(403).json({
        success: false,
        message: 'Only Financial Managers can generate formal reports'
      });
    }

    const { start_date, end_date, title, recipient_roles, action } = req.body;

    // Validate inputs
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    // Generate report title
    const reportTitle = title || `Financial Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;

    // Step 1: Create report record with pending status
    const reportService = getReportService();
    const reportRecord = await reportService.create({
      type: 'formal_financial_report',
      generated_by: new ObjectId(user.id),
      date_range_start: startDate,
      date_range_end: endDate,
      title: reportTitle,
      status: 'pending',
      data: {}
    });

    const reportId = String(reportRecord._id);

    try {
      // Step 2: Aggregate financial data
      logger.info(`Aggregating financial data for report ${reportId}`);
      const reportDataService = getReportDataService();
      const financialData = await reportDataService.getFinancialReportData(startDate, endDate);

      // Step 3: Generate PDF
      logger.info(`Generating PDF for report ${reportId}`);
      const pdfService = getPdfService();
      const pdfResult = await pdfService.generatePDF(financialData, reportId, reportTitle);

      if (!pdfResult.success) {
        // Update report status to failed
        await reportService.update(reportId, {
          status: 'failed',
          error_message: pdfResult.error
        });

        return res.status(500).json({
          success: false,
          message: 'Failed to generate PDF',
          error: pdfResult.error
        });
      }

      // Step 4: Update report record with file info
      await reportService.update(reportId, {
        status: 'completed',
        file_path: pdfResult.file_path,
        file_size: pdfResult.file_size,
        data: {
          summary: financialData.summary,
          period: financialData.period
        }
      });

      // Step 5: Handle distribution if requested
      let recipientsNotified = 0;
      if (action === 'distribute' || action === 'both') {
        if (recipient_roles && Array.isArray(recipient_roles) && recipient_roles.length > 0) {
          logger.info(`Distributing report ${reportId} to roles: ${recipient_roles.join(', ')}`);

          // Fetch all users with the selected roles
          const userService = getUserService();
          const allUsers = await userService.findAll();
          const targetUsers = allUsers.filter((u: any) => recipient_roles.includes(u.role));

          logger.info(`Found ${targetUsers.length} users with selected roles`);

          if (targetUsers.length > 0) {
            const notifications = targetUsers.map((user: any) => ({
              report_id: reportId,
              recipient_id: String(user._id),
              recipient_role: user.role,
              title: 'New Financial Report Available',
              message: `${reportTitle} is now available for review. Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
              read: false
            }));

            logger.info('Creating notifications:', JSON.stringify(notifications, null, 2));

            const notificationService = getNotificationService();
            const result = await notificationService.createBulk(notifications);
            recipientsNotified = targetUsers.length;
            logger.info(`Successfully created ${recipientsNotified} notifications`);
          } else {
            logger.warn('No users found with the selected roles');
          }
        } else {
          logger.warn('No recipient roles provided or recipient_roles array is empty');
        }
      }

      logger.info(`Report ${reportId} generated successfully`);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Report generated successfully',
        data: {
          report_id: reportId,
          title: reportTitle,
          file_path: pdfResult.file_path,
          file_size: pdfResult.file_size,
          period: {
            start_date: startDate,
            end_date: endDate
          },
          recipients_notified: recipientsNotified
        }
      });
    } catch (error: any) {
      // Update report status to failed
      await reportService.update(reportId, {
        status: 'failed',
        error_message: error.message
      });

      throw error;
    }
  } catch (error: any) {
    logger.error('Error generating formal report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

export const downloadReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const user = (req as any).user;

    // Find report
    const reportService = getReportService();
    const report = await reportService.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check permissions
    const isOwner = String(report.generated_by) === user.id;
    const notificationService = getNotificationService();
    const isRecipient = await notificationService.findByRecipient(user.id);
    const hasAccess = isOwner || isRecipient.some((n: any) => String(n.report_id) === reportId);

    if (!hasAccess && !['manager', 'finance'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!report.file_path) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
    }

    // Check if file exists
    const pdfService = getPdfService();
    const fileExists = await pdfService.fileExists(report.file_path);
    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
    }

    // Get file stream
    const fileStream = await pdfService.getFileStream(report.file_path);
    if (!fileStream) {
      return res.status(500).json({
        success: false,
        message: 'Failed to read report file'
      });
    }

    // Set headers for download
    const fileName = `${report.title?.replace(/[^a-z0-9]/gi, '_') || 'financial_report'}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Pipe file to response
    fileStream.pipe(res);
  } catch (error: any) {
    logger.error('Error downloading report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download report',
      error: error.message
    });
  }
};

export const viewReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const user = (req as any).user;

    // Find report
    const reportService = getReportService();
    const report = await reportService.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check permissions
    const isOwner = String(report.generated_by) === user.id;
    const notificationService = getNotificationService();
    const isRecipient = await notificationService.findByRecipient(user.id);
    const hasAccess = isOwner || isRecipient.some((n: any) => String(n.report_id) === reportId);

    if (!hasAccess && !['manager', 'finance'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!report.file_path) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found'
      });
    }

    // Check if file exists
    const pdfService = getPdfService();
    const fileExists = await pdfService.fileExists(report.file_path);
    if (!fileExists) {
      return res.status(404).json({
        success: false,
        message: 'Report file not found on server'
      });
    }

    // Get file stream
    const fileStream = await pdfService.getFileStream(report.file_path);
    if (!fileStream) {
      return res.status(500).json({
        success: false,
        message: 'Failed to read report file'
      });
    }

    // Set headers for inline viewing
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    // Pipe file to response
    fileStream.pipe(res);
  } catch (error: any) {
    logger.error('Error viewing report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to view report',
      error: error.message
    });
  }
};

export const getUserReports = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { page = 1, limit = 20 } = req.query;

    const reportService = getReportService();
    const notificationService = getNotificationService();
    let reports: any[] = [];

    if (user.role === 'finance') {
      // Financial managers see all reports they generated
      reports = await reportService.findByGeneratedBy(user.id);
    } else {
      // Others see reports distributed to them
      const notifications = await notificationService.findByRecipient(user.id);
      const reportIds = notifications.map((n: any) => String(n.report_id));
      
      if (reportIds.length > 0) {
        const allReports = await reportService.findAll();
        reports = allReports.filter((r: any) => reportIds.includes(String(r._id)));
      }
    }

    // Filter formal financial reports only
    reports = reports.filter(r => r.type === 'formal_financial_report' && r.status === 'completed');

    // Sort by date (newest first)
    reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedReports = reports.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        reports: paginatedReports,
        total: reports.length,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil(reports.length / Number(limit))
      }
    });
  } catch (error: any) {
    logger.error('Error fetching user reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports',
      error: error.message
    });
  }
};

export const getReportRecipients = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;

    const userService = getUserService();
    let users: any[] = [];

    if (role) {
      // Get users by specific role
      const allUsers = await userService.findAll();
      users = allUsers.filter((u: any) => u.role === role);
    } else {
      // Get all managers and field officers
      const allUsers = await userService.findAll();
      users = allUsers.filter((u: any) => ['manager', 'field_officer'].includes(u.role));
    }

    // Format response
    const recipients = users.map((u: any) => ({
      user_id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role
    }));

    res.status(200).json({
      success: true,
      data: recipients
    });
  } catch (error: any) {
    logger.error('Error fetching report recipients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipients',
      error: error.message
    });
  }
};
