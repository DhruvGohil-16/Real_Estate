import nodemailer from "nodemailer";

export const sendEmail = async (fromId, toId, subject, text, next) => {
    let epass = null;
    if (fromId === process.env.AgentMail)
        epass = process.env.AgentMailPass;
    else
        epass = process.env.TeamMailPass;
        console.log(toId);
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: fromId,
                pass: epass
            }
        });
        console.log("transporter complete");
        const mailOption = {
            from: fromId,
            to: toId,
            subject: subject,
            text: text
        };
        console.log("mailOption");
        await transporter.sendMail(mailOption);
        return 0;

    } catch (error) {
        console.log(error);
        return -1;
    }
}