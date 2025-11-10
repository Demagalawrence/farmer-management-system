import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import logger from './logger';
import { getDb } from '../config/db';
import { EmailQueue, EmailQueueInput } from '../models/EmailQueue';

let transporter: Transporter | null = null;
let isVerified = false;

// Create transporter lazily to ensure env vars are loaded
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify once
    if (process.env.SMTP_USER && process.env.SMTP_PASS && !isVerified) {
      transporter.verify((error) => {
        if (error) {
          logger.error('❌ Email transporter verification failed:', error);
        } else {
          logger.info('✅ Email server is ready to send messages');
          isVerified = true;
        }
      });
    }
  }
  return transporter;
}

/**
 * Add email to queue for sending/retry
 */
async function queueEmail(emailData: EmailQueueInput): Promise<void> {
  try {
    const db = getDb();
    const emailQueue: EmailQueue = {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      from: emailData.from,
      payment_id: emailData.payment_id,
      farmer_name: emailData.farmer_name,
      status: 'pending',
      attempts: 0,
      max_attempts: emailData.max_attempts || 100,
      created_at: new Date(),
    };
    
    await db.collection('email_queue').insertOne(emailQueue);
    logger.info(`📧 Email queued for ${emailData.to} (Payment: ${emailData.payment_id})`);
  } catch (error: any) {
    logger.error('Failed to queue email:', error.message);
  }
}

/**
 * Attempt to send an email immediately, queue if fails
 */
async function sendOrQueueEmail(mailOptions: any, paymentId?: string, farmerName?: string): Promise<boolean> {
  // Skip if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('⚠️ SMTP not configured. Email queued for later.');
    await queueEmail({
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      from: mailOptions.from,
      payment_id: paymentId,
      farmer_name: farmerName,
    });
    return false;
  }

  try {
    const emailTransporter = getTransporter();
    const info = await emailTransporter.sendMail(mailOptions);
    logger.info(`✅ Email sent immediately to ${mailOptions.to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error: any) {
    logger.error(`❌ Failed to send email to ${mailOptions.to}: ${error.message}`);
    logger.info('📥 Queueing email for retry...');
    
    // Queue for retry
    await queueEmail({
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      from: mailOptions.from,
      payment_id: paymentId,
      farmer_name: farmerName,
    });
    
    return false;
  }
}

/**
 * Send payment confirmation email to farmer
 * @param toEmail - Farmer's email address
 * @param farmerName - Farmer's name
 * @param amount - Payment amount (actual amount being paid)
 * @param paymentId - Payment ID
 * @param paymentType - Type of payment (advance, final, etc.)
 * @param calculation - Optional calculation data with totalExpectedPayment
 */
export async function sendPaymentEmail(
  toEmail: string,
  farmerName: string,
  amount: number,
  paymentId: string,
  paymentType: string = 'payment',
  calculation?: any
): Promise<void> {
  // Skip if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    logger.warn('⚠️ SMTP not configured. Skipping email send.');
    return;
  }

  // Skip if farmer has no email
  if (!toEmail) {
    logger.warn(`⚠️ No email address provided for farmer ${farmerName}. Skipping email send.`);
    return;
  }

  // Determine if this is an advance payment and calculate details
  const isAdvancePayment = paymentType === 'advance';
  const totalExpectedPayment = calculation?.totalExpectedPayment || (isAdvancePayment ? amount / 0.3 : amount);
  const remainingAmount = isAdvancePayment ? totalExpectedPayment - amount : 0;

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Farm Management System" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: isAdvancePayment 
      ? '30% Advance Payment Processed — Farm Management System'
      : 'Payment Confirmation — Farm Management System',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${isAdvancePayment ? '#f59e0b 0%, #d97706 100%' : '#667eea 0%, #764ba2 100%'}); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .amount { font-size: 28px; font-weight: bold; color: #10b981; margin: 20px 0; padding: 15px; background: #ecfdf5; border-radius: 8px; text-align: center; }
          .breakdown { background: #fff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0; }
          .breakdown-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .breakdown-row:last-child { border-bottom: none; font-weight: bold; }
          .info-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🌾 Farm Management System</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">${isAdvancePayment ? '30% Advance Payment' : 'Payment Confirmation'}</p>
          </div>
          <div class="content">
            <p>Hello <strong>${farmerName}</strong>,</p>
            ${isAdvancePayment 
              ? `<p>Great news! Your <strong>30% advance payment</strong> has been processed successfully. This upfront payment is to help you purchase inputs and prepare for the upcoming harvest.</p>`
              : `<p>Great news! Your ${paymentType} has been processed successfully.</p>`
            }
            
            <div class="amount">
              💰 UGX ${amount.toLocaleString()}
            </div>
            
            ${isAdvancePayment ? `
              <div class="info-box">
                <strong>📌 Important Information:</strong>
                <p style="margin: 10px 0 0 0;">This is <strong>30% of your total expected payment</strong>. The remaining 70% will be paid after harvest completion and quality verification.</p>
              </div>
              
              <div class="breakdown">
                <h3 style="margin-top: 0; color: #374151;">Payment Breakdown</h3>
                <div class="breakdown-row">
                  <span>Total Expected Payment:</span>
                  <span><strong>UGX ${totalExpectedPayment.toLocaleString()}</strong></span>
                </div>
                <div class="breakdown-row">
                  <span>Advance Payment (30%):</span>
                  <span style="color: #10b981;"><strong>UGX ${amount.toLocaleString()}</strong></span>
                </div>
                <div class="breakdown-row">
                  <span>Remaining Balance (70%):</span>
                  <span style="color: #f59e0b;"><strong>UGX ${remainingAmount.toLocaleString()}</strong></span>
                </div>
              </div>
              
              <p><strong>What's Next?</strong></p>
              <ul>
                <li>Use this advance payment to purchase seeds, fertilizers, and other farming inputs</li>
                <li>Complete your planting and crop management activities</li>
                <li>After harvest, the remaining <strong>70% (UGX ${remainingAmount.toLocaleString()})</strong> will be processed</li>
              </ul>
            ` : `
              <p><strong>Payment Details:</strong></p>
              <ul>
                <li>Payment ID: <code>${paymentId}</code></li>
                <li>Type: ${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)}</li>
                <li>Status: <span style="color: #10b981; font-weight: bold;">✓ Processed</span></li>
              </ul>
            `}
            
            <p style="margin-top: 20px;"><strong>Payment Reference:</strong> <code>${paymentId}</code></p>
            
            <p>The funds should reflect in your account shortly. If you have any questions or concerns, please contact your Field Officer or Finance Manager.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br/>
              <strong>Farm Management Team</strong>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} Farm Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  // Use queue-based sending with automatic retry
  await sendOrQueueEmail(mailOptions, paymentId, farmerName);
}

