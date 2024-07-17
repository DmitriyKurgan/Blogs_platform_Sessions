import {devicesCollection} from "../repositories/db";
import {ObjectId, DeleteResult} from "mongodb";
import {DeviceType, } from "../utils/types";
export const devices = [] as DeviceType[]

export const devicesRepository = {
   async deleteDevice(deviceID:string){

        const result: DeleteResult = await devicesCollection.deleteOne({_id: new ObjectId(deviceID)})

       return result.deletedCount === 1
    }

}