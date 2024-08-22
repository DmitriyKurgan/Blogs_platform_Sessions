import {rateLimitsCollection} from "./db";

export const attemptsRepository = {
        async addAttempts(userIP: string, url: string, time: Date) {
            return rateLimitsCollection.insertOne({userIP, url, time})
        },
        async countOfAttempts(userIP: string, url: string, timeLimit: Date) {
            return rateLimitsCollection.countDocuments({userIP, url, time: {$gt: timeLimit}})
    }
}
