import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `Smart Inventory Manager <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent to:", to);

    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export default sendEmail;