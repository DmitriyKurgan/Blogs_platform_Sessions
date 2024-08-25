import {devicesCollection} from "../repositories/db";
import {ObjectId, DeleteResult, WithId} from "mongodb";
import {DeviceType, } from "../utils/types";
import {ExtendedSessionType} from "../services/devices-service";
export const devices = [] as DeviceType[]

export const devicesRepository = {
    async createDevice(session:ExtendedSessionType){
        const result = await devicesCollection.insertOne(session);
        return result;
    },
    async updateDevice(
        ip: string,
        deviceId: string,
        issuedAt: number
    ){
        const result = await devicesCollection.updateOne(
            { deviceId },
            {
                $set: {
                    lastActiveDate: issuedAt,
                    ip,
                },
            }
        );
        return result.matchedCount === 1;
    },
   async deleteDevice(deviceID:string){
       const result: DeleteResult = await devicesCollection.deleteOne({deviceId: deviceID});
       return result.deletedCount === 1;
    },
    async deleteAllOldDevices(currentDeviceID:string){
        return devicesCollection.deleteMany({deviceId: {$ne: currentDeviceID}});
    },
    async findDeviceById(deviceID:string){
        const result: WithId<DeviceType> | null = await devicesCollection.findOne({deviceId:deviceID});
        return result
    }
}