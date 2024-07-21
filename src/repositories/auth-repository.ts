import {ObjectId, UpdateResult} from "mongodb";
import {usersCollection} from "./db";

export const authRepository = {
    async updateConfirmation(userID:string):Promise<boolean>{
        const result: UpdateResult = await usersCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.isConfirmed':true}});
        return result.matchedCount === 1
    },
    async updateConfirmationCode(userID:string, confirmationCode:string):Promise<boolean>{
        const result: UpdateResult = await usersCollection.updateOne({_id:new ObjectId(userID)},
            {$set:{'emailConfirmation.confirmationCode':confirmationCode}});
        return result.matchedCount === 1
    }
}
