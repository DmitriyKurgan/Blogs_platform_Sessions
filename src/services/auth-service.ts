import {OutputUserType} from "../utils/types";
import bcrypt from 'bcrypt'
import {authRepository} from "../repositories/auth-repository";
import {authQueryRepository} from "../repositories/query-repositories/auth-query-repository";
import {randomUUID} from "crypto";
import {emailService} from "./email-service";
export const users = [] as OutputUserType[]

export const authService:any = {
    async confirmRegistration(confirmationCode:string):Promise<boolean>{
        const userAccount:OutputUserType | null = await authQueryRepository.findUserByEmailConfirmationCode(confirmationCode);
        if (!userAccount) return false;
        if (userAccount.emailConfirmation.isConfirmed) return false;
        if (userAccount.emailConfirmation.confirmationCode !== confirmationCode) return false;
        if (userAccount.emailConfirmation.expirationDate < new Date()) return false;

        const result = await authRepository.updateConfirmation(userAccount.id);
        return result

    },
    async updateConfirmationCode(userAccount:OutputUserType, confirmationCode:string):Promise<boolean>{
        const result = await authRepository.updateConfirmationCode(userAccount.id, confirmationCode);
        return result

    },
    async _generateHash(password:string, salt:string):Promise<string>{
        const hash = await bcrypt.hash(password, salt);
        return hash
    },
    async resendEmail(email: string): Promise<boolean> {
        const userAccount: OutputUserType | null = await authQueryRepository.findByLoginOrEmail(email);
        if (!userAccount || !userAccount.emailConfirmation.confirmationCode) {
            return false;
        }
        const newConfirmationCode:string = randomUUID();
        await emailService.sendEmail(userAccount, newConfirmationCode)
        return authService.updateConfirmationCode(
            userAccount,
            newConfirmationCode
        );
    }

}