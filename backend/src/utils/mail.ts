import nodemailer from "nodemailer";

export const sendEmail = async (options: {
    email: string;
    subject: string;
    message: string;
}) => {
    // For development, we'll log to console if SMTP is not configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.log("------------------------------------------");
        console.log("📧 EMAIL SIMULATION (SMTP not configured)");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log("------------------------------------------");
        return;
    }

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
        from: `"Adama City" <${smtpUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<p>${options.message.replace(/\n/g, "<br>")}</p>`,
    };

    await transporter.sendMail(mailOptions);
};
