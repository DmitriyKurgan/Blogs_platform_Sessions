import {CommentType, DeviceType, OutputCommentType} from "../utils/types";

import {devicesRepository} from "../repositories/devices-repository";
import {randomUUID} from "crypto";
import {jwtService} from "../application/jwt-service";
import {devicesCollection} from "../repositories/db";
import {DevicesMapping} from "../repositories/query-repositories/devices-query-repository";

export const comments = [] as OutputCommentType[]
export type ExtendedSessionType = DeviceType & {userId:string}
export const devicesService: any = {
    async createDevice(userId: string, ip:string, title:string, lastActiveDate:string ): Promise<any> {
        const deviceId = randomUUID();
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
        await devicesRepository.deleteAllOldDevices(currentDeviceId);
    },
}