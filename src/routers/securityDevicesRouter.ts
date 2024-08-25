import {Request, Response, Router} from "express";
import {
    authMiddleware,
    validateErrorsMiddleware, validationDeviceOwner, validationDevicesFindByParamId,
} from "../middlewares/middlewares";

import {devicesService} from "../services/devices-service";
import {jwtService} from "../application/jwt-service";
import {devicesQueryRepository} from "../repositories/query-repositories/devices-query-repository";
import {CodeResponsesEnum} from "../utils/utils";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', async (req:Request, res:Response)=>{

    const cookieRefreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getUserIdByToken(cookieRefreshToken);
    console.log('userId: ', userId)
    if (userId) {
        const foundDevices = await devicesQueryRepository.getAllDevices(
            userId
        );
        res.json(foundDevices);
    } else {
        res.sendStatus(401);
    }

})

securityDevicesRouter.delete('/:deviceId', validationDevicesFindByParamId, validateErrorsMiddleware, validationDeviceOwner, async (req:Request, res:Response)=>{
    const isDeleted = await devicesService.deleteDevice(
        req.params.deviceId
    );
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
})


securityDevicesRouter.delete('/', authMiddleware, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const cookieRefreshToken = req.cookies.refreshToken;
    const deviceId = jwtService.getDeviceIdFromToken(cookieRefreshToken)
    console.log('currentDeviceID: ', deviceId)
    if (deviceId) {
       const isDeleted = await devicesService.deleteAllOldDevices(deviceId);
       if (isDeleted){
           const devices = await devicesQueryRepository.getAllDevices(req.userId!);
           res.json(devices).status(204);
       }
    } else {
        res.sendStatus(401);
    }
})
