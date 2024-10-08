import {Request, Response, Router} from "express";
import {CodeResponsesEnum} from "../utils/utils";
import {
    blogsCollection,
    commentsCollection, devicesCollection,
    postsCollection, rateLimitsCollection, requestsCollection,
    usersCollection
} from "../repositories/db";
export const testingRouter = Router({})

testingRouter.delete('/', async (req:Request, res: Response) => {
    try {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
        await usersCollection.deleteMany({});
        await commentsCollection.deleteMany({});
        await devicesCollection.deleteMany({});
        await requestsCollection.deleteMany({});
        await rateLimitsCollection.deleteMany({});
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    } catch (error) {
        console.error("Error occurred while clearing the database:", error);
        res.sendStatus(500);
    }
})

