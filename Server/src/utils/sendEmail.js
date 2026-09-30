import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    
    const mailOptions = {
        from: `Learnify <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.htmlMessage,
    };

    
    await transport.sendMail(mailOptions)
};