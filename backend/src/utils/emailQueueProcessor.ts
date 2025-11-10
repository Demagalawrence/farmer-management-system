import nodemailer from 'nodemailer';
import { getDb } from '../config/db';
import { EmailQueue } from '../models/EmailQueue';
import logger from './logger';

let processorInterval: NodeJS.Timeout | null = null;

/**
 * Process pending emails in the queue
 */
export async function processEmailQueue(): Promise<void> {
  try {
    const db = getDb();
    
    // Find pending emails that haven't exceeded max attempts
    const pendingEmails = await db.collection<EmailQueue>('email_queue')
      .find({
        status: 'pending',
        $expr: { $lt: ['$attempts', '$max_attempts'] }
      })
      .limit(10) // Process 10 at a time
      .toArray();

    if (pendingEmails.length === 0) {
      return; // No emails to process
    }

    logger.info(`📧 Processing ${pendingEmails.length} queued emails...`);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Process each email
    for (const email of pendingEmails) {
      try {
        // Attempt to send
        const info = await transporter.sendMail({
          from: email.from || `"Farm Management System" <${process.env.SMTP_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        });

        // Mark as sent
        await db.collection('email_queue').updateOne(
          { _id: email._id },
          {
            $set: {
              status: 'sent',
              sent_at: new Date(),
              last_attempt_at: new Date(),
            },
            $inc: { attempts: 1 }
          }
        );

        logger.info(`✅ Queued email sent to ${email.to}. Message ID: ${info.messageId}`);
      } catch (error: any) {
        // Update attempt count and error
        const newAttempts = (email.attempts || 0) + 1;
        const status = newAttempts >= email.max_attempts ? 'failed' : 'pending';

        await db.collection('email_queue').updateOne(
          { _id: email._id },
          {
            $set: {
              status,
              last_attempt_at: new Date(),
              last_error: error.message,
            },
            $inc: { attempts: 1 }
          }
        );

        if (status === 'failed') {
          logger.error(`❌ Email to ${email.to} failed after ${newAttempts} attempts. Giving up.`);
        } else {
          logger.warn(`⚠️ Email to ${email.to} failed (attempt ${newAttempts}/${email.max_attempts}). Will retry.`);
        }
      }

      // Small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
    }
  } catch (error: any) {
    logger.error('Error processing email queue:', error.message);
  }
}

/**
 * Start the email queue processor (runs every 5 minutes)
 */
export function startEmailQueueProcessor(): void {
  if (processorInterval) {
    logger.warn('Email queue processor is already running');
    return;
  }

  logger.info('🚀 Starting email queue processor (runs every 5 minutes)');

  // Run immediately on start
  processEmailQueue();

  // Then run every 5 minutes
  processorInterval = setInterval(() => {
    processEmailQueue();
  }, 5 * 60 * 1000); // 5 minutes
}

/**
 * Stop the email queue processor
 */
export function stopEmailQueueProcessor(): void {
  if (processorInterval) {
    clearInterval(processorInterval);
    processorInterval = null;
    logger.info('⏹️ Email queue processor stopped');
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
  pending: number;
  sent: number;
  failed: number;
  total: number;
}> {
  try {
    const db = getDb();
    const collection = db.collection<EmailQueue>('email_queue');

    const [pending, sent, failed, total] = await Promise.all([
      collection.countDocuments({ status: 'pending' }),
      collection.countDocuments({ status: 'sent' }),
      collection.countDocuments({ status: 'failed' }),
      collection.countDocuments({}),
    ]);

    return { pending, sent, failed, total };
  } catch (error: any) {
    logger.error('Error getting queue stats:', error.message);
    return { pending: 0, sent: 0, failed: 0, total: 0 };
  }
}
