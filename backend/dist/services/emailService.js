"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailServiceImpl {
    constructor() {
        this.transporter = null;
        const cfg = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            from: process.env.SMTP_FROM,
        };
        if (cfg.host && cfg.port && cfg.user && cfg.pass) {
            this.transporter = nodemailer_1.default.createTransport({
                host: cfg.host,
                port: cfg.port,
                secure: cfg.secure ?? (cfg.port === 465),
                auth: { user: cfg.user, pass: cfg.pass },
            });
            this.from = cfg.from || cfg.user;
        }
    }
    async send(to, subject, text, html) {
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
        }
        catch (err) {
            console.error('Email send failed:', err);
        }
    }
}
exports.EmailService = new EmailServiceImpl();
//# sourceMappingURL=emailService.js.map