import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('🔍 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('SMTP_HOST:', process.env.SMTP_HOST);
  console.log('SMTP_PORT:', process.env.SMTP_PORT);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  console.log('\n');

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ SMTP credentials not configured in .env file');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true, // Enable debug output
    logger: true, // Log to console
  });

  // Verify connection
  console.log('📡 Verifying SMTP connection...\n');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');
  } catch (error: any) {
    console.error('❌ SMTP connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('\nPossible issues:');
    console.error('1. Check if 2-Step Verification is enabled on Gmail');
    console.error('2. Make sure you are using an App Password (not your regular Gmail password)');
    console.error('3. Verify the App Password is correct (no spaces)');
    process.exit(1);
  }

  // Send test email
  const testRecipient = process.env.SMTP_USER; // Send to self for testing
  console.log(`📧 Sending test email to ${testRecipient}...\n`);

  const mailOptions = {
    from: process.env.SMTP_FROM || `"Farm Management System" <${process.env.SMTP_USER}>`,
    to: testRecipient,
    subject: 'Test Email - Farm Management System',
    html: `
      <h1>✅ Email Configuration Test Successful!</h1>
      <p>If you're reading this, your email configuration is working correctly!</p>
      <hr>
      <p><strong>Configuration Details:</strong></p>
      <ul>
        <li>SMTP Host: ${process.env.SMTP_HOST}</li>
        <li>SMTP Port: ${process.env.SMTP_PORT}</li>
        <li>SMTP User: ${process.env.SMTP_USER}</li>
        <li>From: ${process.env.SMTP_FROM}</li>
      </ul>
      <hr>
      <p>Your Farm Management System is ready to send payment confirmation emails!</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('\n✨ Email system is working correctly!');
    console.log(`Check inbox: ${testRecipient}`);
  } catch (error: any) {
    console.error('❌ Failed to send test email:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Response:', error.response);
    console.error('\nFull error:', error);
  }
}

// Run the test
testEmail();
