import {OutputUserType } from "../utils/types";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {emailManager} from "../managers/email-manager";
export const users = [] as OutputUserType[]

export const emailService:any = {
    async sendEmail(userAccount:OutputUserType, confirmationCode:string):Promise<SMTPTransport.SentMessageInfo | null> {
        debugger
        const message =  `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
        </p>`
        try {
            const gmailResponse:SMTPTransport.SentMessageInfo = await emailManager.sendEmail(userAccount.accountData.email, message);
            console.log('confirmationCode:', confirmationCode)
            return gmailResponse
        } catch (error) {
            console.error(error);
            return null;
        }
    },
}