import { DeviceType, OutputCommentType} from "../utils/types";

import {devicesRepository} from "../repositories/devices-repository";
import {randomUUID} from "crypto";

export const comments = [] as OutputCommentType[]
export type ExtendedSessionType = DeviceType & {userId:string}
export const devicesService: any = {
    async createDevice(userId: string, ip:string, title:string, lastActiveDate:string, deviceId:string ): Promise<any> {
        const newSession: ExtendedSessionType = {
            userId,
            ip,
            deviceId,
            lastActiveDate,
            title,
        };

        return await devicesRepository.createDevice(newSession);
    },
    async deleteDevice(deviceID: string): Promise<boolean> {
        return await devicesRepository.deleteDevice(deviceID);
    },
    async deleteAllOldDevices(currentDeviceId:string):Promise<any | { error: string }> {
      return await devicesRepository.deleteAllOldDevices(currentDeviceId);
    },
    async findDeviceById(currentDeviceId:string):Promise<any | { error: string }> {
       return await devicesRepository.findDeviceById(currentDeviceId);
    },
}