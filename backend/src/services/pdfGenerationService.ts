import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import path from 'path';
import { format } from 'date-fns';
import { generateReportHTML } from '../templates/reportTemplate';
import { FinancialReportData } from './reportDataService';

export interface PDFGenerationResult {
  success: boolean;
  file_path?: string;
  file_size?: number;
  error?: string;
}

export class PDFGenerationService {
  private storageDir: string;

  constructor() {
    // Set storage directory
    this.storageDir = path.join(__dirname, '../../storage/reports');
    this.ensureStorageDirectory();
  }

  private async ensureStorageDirectory() {
    try {
      await fs.ensureDir(this.storageDir);
      
      // Create year/month subdirectories
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const monthDir = path.join(this.storageDir, `${year}`, month);
      await fs.ensureDir(monthDir);
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }
  }

  private generateFileName(reportId: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = format(now, 'yyyyMMdd-HHmmss');
    return `${year}/${month}/report-${reportId}-${timestamp}.pdf`;
  }

  async generatePDF(
    reportData: FinancialReportData,
    reportId: string,
    title: string
  ): Promise<PDFGenerationResult> {
    let browser;
    
    try {
      // Generate HTML content
      const htmlContent = generateReportHTML(reportData, title);

      // Launch headless browser
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Set content
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const fileName = this.generateFileName(reportId);
      const fullPath = path.join(this.storageDir, fileName);

      // Ensure directory exists
      await fs.ensureDir(path.dirname(fullPath));

      await page.pdf({
        path: fullPath,
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        },
        printBackground: true
      });

      await browser.close();

      // Get file size
      const stats = await fs.stat(fullPath);
      const fileSize = stats.size;

      return {
        success: true,
        file_path: fileName,
        file_size: fileSize
      };
    } catch (error: any) {
      if (browser) {
        await browser.close();
      }

      console.error('PDF Generation Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate PDF'
      };
    }
  }

  async getFilePath(relativePath: string): Promise<string> {
    return path.join(this.storageDir, relativePath);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      const fullPath = await this.getFilePath(relativePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async deleteFile(relativePath: string): Promise<boolean> {
    try {
      const fullPath = await this.getFilePath(relativePath);
      await fs.remove(fullPath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async getFileStream(relativePath: string): Promise<fs.ReadStream | null> {
    try {
      const fullPath = await this.getFilePath(relativePath);
      const exists = await this.fileExists(relativePath);
      
      if (!exists) {
        return null;
      }

      return fs.createReadStream(fullPath);
    } catch (error) {
      console.error('Error creating file stream:', error);
      return null;
    }
  }
}
