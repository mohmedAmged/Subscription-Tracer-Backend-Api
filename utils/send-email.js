import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter, { accountEmail } from "../config/nodemailer.js";

export const sendReminderEmail = async (to, type, subscription) =>{
    if (!to || !type) throw new Error("Missing required parameters.");

    const template = emailTemplates.find((t) => t.label === type);

    if (!template) throw new Error(`invalid email type: ${type}`);

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMMM D, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const emailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message, 
    }
    // transporter.sendMail(emailOptions, (error, info) => {
    //     if (error) return console.log(error, "Error sending email:");
    //     console.log('Email sent: ' + info.response);
    // })
    return new Promise((resolve, reject) => {
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}