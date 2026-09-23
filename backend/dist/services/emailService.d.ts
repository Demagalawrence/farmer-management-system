declare class EmailServiceImpl {
    private transporter;
    private from;
    constructor();
    send(to: string, subject: string, text: string, html?: string): Promise<void>;
}
export declare const EmailService: EmailServiceImpl;
export {};
//# sourceMappingURL=emailService.d.ts.map