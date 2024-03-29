import nodemailer from "nodemailer";

export const sendEmail = async (fromId, toId, subject, text, next) => {
    let epass = null;
    if (fromId === process.env.AgentMail)
        epass = process.env.AgentMailPass;
    else
        epass = process.env.TeamMailPass;
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: fromId,
                pass: epass
            }
        });
        const mailOption = {
            from: fromId,
            to: toId,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOption);
        return 0;

    } catch (error) {
        return -1;
    }
}