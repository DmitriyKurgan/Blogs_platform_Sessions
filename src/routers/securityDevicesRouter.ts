import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {
    authMiddleware,
    validateAuthorization, validateDevicesRequests,
    validateErrorsMiddleware,
    validationBlogsFindByParamId
} from "../middlewares/middlewares";

import {devicesService} from "../services/devices-service";
import {jwtService} from "../application/jwt-service";
import {devicesQueryRepository} from "../repositories/query-repositories/devices-query-repository";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', authMiddleware, validateErrorsMiddleware, async (req:Request, res:Response)=>{
    const cookieRefreshToken = req.cookies.refreshToken;
    const cookieRefreshTokenObj = await jwtService.verifyToken(
        cookieRefreshToken
    );

    if (cookieRefreshTokenObj) {
        const userId = cookieRefreshTokenObj!.userId.toString();
        const foundDevices = await devicesQueryRepository.getAllDevices(
            userId
        );
        res.json(foundDevices);
    } else {
        res.sendStatus(401);
    }

})

securityDevicesRouter.delete('/:id', authMiddleware, validateErrorsMiddleware, async (req:Request, res:Response)=>{
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
    const cookieRefreshTokenObj = await jwtService.verifyToken(
        cookieRefreshToken
    );
    if (cookieRefreshTokenObj) {
        const currentDevice = cookieRefreshTokenObj.deviceId;
        await devicesService.deleteAllOldDevices(currentDevice);
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
})
