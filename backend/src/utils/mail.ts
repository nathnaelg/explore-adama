import nodemailer from "nodemailer";

export const sendEmail = async (options: {
    email: string;
    subject: string;
    message: string;
}) => {
    // For development, we'll log to console if SMTP is not configured
    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpPort = parseInt(process.env.SMTP_PORT?.trim() || "587");
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.log("------------------------------------------");
        console.log("📧 EMAIL SIMULATION (SMTP not configured)");
        console.log("Missing:", { smtpHost: !!smtpHost, smtpUser: !!smtpUser, smtpPass: !!smtpPass });
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("------------------------------------------");
        return;
    }

    console.log(`📧 Attempting to send real email to: ${options.email} via ${smtpHost}:${smtpPort}`);

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        const mailOptions = {
            from: `"Explore Adama" <${smtpUser}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: `<p>${options.message.replace(/\n/g, "<br>")}</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error; // Re-throw so the controller can handle it
    }
};
