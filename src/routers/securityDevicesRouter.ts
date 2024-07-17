import {Request, Response, Router} from "express";
import {blogsService} from "../services/blogs-service";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {
    validateAuthorization, validateDevicesRequests,
    validateErrorsMiddleware,
    validationBlogsFindByParamId
} from "../middlewares/middlewares";
import {devicesQueryRepository} from "../repositories/query-repositories/devices-query-repository";
import {devicesRepository} from "../repositories/devices-repository";
import {devicesService} from "../services/devices-service";

;

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', validateAuthorization, validateDevicesRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const devices = await devicesQueryRepository.getAllDevices();
    if(!devices || !devices.items.length) {
        return res.status(CodeResponsesEnum.Not_found_404).send([])
    }
    res.status(CodeResponsesEnum.OK_200).send(devices)
})

securityDevicesRouter.delete('/:id', validateAuthorization, validateDevicesRequests, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const deviceID: string = req.deviceId!
    const isDeleted:boolean = await devicesService.deleteDevice(deviceID);
    if (!isDeleted || !deviceID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


