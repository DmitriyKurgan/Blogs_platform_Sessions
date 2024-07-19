import {devicesCollection} from "../repositories/db";
import {ObjectId, DeleteResult} from "mongodb";
import {DeviceType, } from "../utils/types";
import {ExtendedSessionType} from "../services/devices-service";
export const devices = [] as DeviceType[]

export const devicesRepository = {
    async createDevice(session:ExtendedSessionType){
        const result = await devicesCollection.insertOne(session);
        return result;
    },
   async deleteDevice(deviceID:string){
       const result: DeleteResult = await devicesCollection.deleteOne({_id: new ObjectId(deviceID)});
       return result.deletedCount === 1;
    },
    async deleteAllOldDevices(currentDeviceID:string){
        const result: DeleteResult = await devicesCollection.deleteMany({deviceId: {$ne: currentDeviceID}});
        return result.deletedCount === 1;
    }
}