import {CommentType, OutputCommentType} from "../utils/types";
import {commentsRepository} from "../repositories/comments-repository";
import {devicesRepository} from "../repositories/devices-repository";

export const comments = [] as OutputCommentType[]

export const devicesService: any = {
    async deleteDevice(deviceID: string): Promise<boolean> {
        return await devicesRepository.deleteDevice(deviceID);
    },
}