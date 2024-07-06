import {EazeUserType, OutputUserType, UserDBType} from "../../utils/types";
import {ObjectId, WithId} from "mongodb";
import {getUsersFromDB} from "../../utils/utils";
import {usersCollection} from "../db";

export const UserMapper = (user : WithId<UserDBType>) : OutputUserType => {
    return {
        id: user._id.toString(),
        accountData:{...user.accountData},
        emailConfirmation:{...user.emailConfirmation},
    }
}
export const UserSimpleMapper = (user : WithId<UserDBType>):EazeUserType =>{
    return {
        id: user._id.toString(),
        email:user.accountData.email,
        login:user.accountData.userName,
        createdAt:user.accountData.createdAt,
    }
}

export const usersQueryRepository = {
    async getAllUsers(query: any): Promise<any | { error: string }> {
        return getUsersFromDB(query);
    },
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user ? UserSimpleMapper(user) : null
},
    async findUserByID(userID:string){
        const user = await usersCollection.findOne({_id: new ObjectId(userID)})
        return user ? UserSimpleMapper(user) : null
    }
}
