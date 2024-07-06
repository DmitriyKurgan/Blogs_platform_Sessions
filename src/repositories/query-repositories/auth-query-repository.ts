import { WithId} from "mongodb";
import {UserDBType} from "../../utils/types";
import {usersCollection} from "../db";
import {UserMapper} from "./users-query-repository";


export const authQueryRepository = {
    async findUserByEmailConfirmationCode(confirmationCode:string){
        const userAccount:WithId<UserDBType> | null = await usersCollection.findOne({"emailConfirmation.confirmationCode":confirmationCode})
        return userAccount ? UserMapper(userAccount) : null
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const userAccount:WithId<UserDBType> | null = await usersCollection.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return userAccount ? UserMapper(userAccount) : null
    },
}
