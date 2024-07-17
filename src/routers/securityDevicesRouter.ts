import {Request, Response, Router} from "express";
import {blogsService} from "../services/blogs-service";
import {CodeResponsesEnum, getQueryValues} from "../utils/utils";
import {
    validateAuthorization,
    validateErrorsMiddleware,
    validationBlogsFindByParamId
} from "../middlewares/middlewares";
import {devicesQueryRepository} from "../repositories/query-repositories/devices-query-repository";

;

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', async (req:Request, res:Response)=>{
    const devices = await devicesQueryRepository.getAllDevices();
    if(!devices || !devices.items.length) {
        return res.status(CodeResponsesEnum.Not_found_404).send([])
    }
    res.status(CodeResponsesEnum.OK_200).send(devices)
})

securityDevicesRouter.delete('/:id', validateAuthorization, validationBlogsFindByParamId, validateErrorsMiddleware,async (req:Request, res:Response)=>{
    const blogID:string = req.params.id;
    const isDeleted:boolean = await blogsService.deleteBlog(blogID);
    if (!isDeleted || !blogID){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


