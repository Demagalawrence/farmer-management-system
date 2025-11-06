import nodemailer from 'nodemailer';

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
}

class EmailServiceImpl {
  private transporter: nodemailer.Transporter | null = null;
  private from: string | undefined;

  constructor() {
    const cfg: EmailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM,
    };

    if (cfg.host && cfg.port && cfg.user && cfg.pass) {
      this.transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure ?? (cfg.port === 465),
        auth: { user: cfg.user, pass: cfg.pass },
      });
      this.from = cfg.from || cfg.user;
    }
  }

  async send(to: string, subject: string, text: string, html?: string): Promise<void> {
    if (!this.transporter || !this.from) {
      console.warn('Email disabled: SMTP not configured');
      return;
    }
    try {
      await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        text,
        html,
      });
      console.info(`Email sent to ${to} | ${subject}`);
    } catch (err) {
      console.error('Email send failed:', err);
    }
  }
}

export const EmailService = new EmailServiceImpl();
