import {OutputUserType } from "../utils/types";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {emailManager} from "../managers/email-manager";
export const users = [] as OutputUserType[]

export const emailService:any = {
    async sendEmail(email:string, confirmationCode:string):Promise<void> {
        const message =  `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        try {
            await emailManager.sendEmail(email, message);
            console.log('confirmationCode:', confirmationCode)
        } catch (error) {
            console.error(error);
        }
    },
}