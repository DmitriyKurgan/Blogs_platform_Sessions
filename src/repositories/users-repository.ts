import {usersCollection} from "./db";
import {InsertOneResult, ObjectId, DeleteResult} from "mongodb";
import {EazeUserType, UserDBType} from "../utils/types";
import {UserMapper, UserSimpleMapper} from "./query-repositories/users-query-repository";

export const usersRepository = {
    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or: [{"accountData.userName":loginOrEmail}, {"accountData.email":loginOrEmail}]})
        return user ? UserMapper(user) : null
    },
    async findUserByID(userID:string){
        const user = await usersCollection.findOne({_id: new ObjectId(userID)})
        return user ? UserMapper(user) : null
    },
    async createUser(newUser:UserDBType):Promise<EazeUserType | any> {
        const result:InsertOneResult<UserDBType> = await usersCollection.insertOne(newUser);
         const user = await usersCollection.findOne({_id: result.insertedId});
         return user ? UserSimpleMapper(user) : null;
    },
   async deleteUser(userID:string): Promise<boolean>{
        const result: DeleteResult = await usersCollection.deleteOne({_id:new ObjectId(userID)});
        return result.deletedCount === 1
    }

}