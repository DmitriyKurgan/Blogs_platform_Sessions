import { devicesCollection} from "../db";
import {WithId} from "mongodb";
import {DeviceType} from "../../utils/types";
import {ExtendedSessionType} from "../../services/devices-service";

export const DevicesMapping = (devices: any) => {
    return devices.map((device: any   ) => {
        // @ts-ignore
        return {
            ip: device.ip,
            title: device.title,
            lastActiveDate: new Date(device.lastActiveDate * 1000).toISOString(),
            deviceId: device.deviceId,
        };
})}

export const devicesQueryRepository = {
    async getAllDevices(userId:string):Promise<any | { error: string }> {
        const devices =  devicesCollection.find({userId});
        return DevicesMapping(devices)
    },
}
