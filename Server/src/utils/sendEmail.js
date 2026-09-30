import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    // 1. Transporter configuration
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // 2. Email Options
    const mailOptions = {
        from: `Learnify <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.htmlMessage,
    };

    //Send Email
    await transport.sendMail(mailOptions)
};