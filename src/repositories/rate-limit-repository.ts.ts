import {devicesCollection, rateLimitsCollection} from "../repositories/db";
import {ObjectId, DeleteResult, WithId} from "mongodb";
import {DeviceType, RateLimitType,} from "../utils/types";
import {ExtendedSessionType} from "../services/devices-service";


export const rateLimits = [] as RateLimitType[]

export const rateLimitsRepository = {
    async findRateLimit(
        ip: string,
        endpoint: string
    ): Promise<any | null> {
        const foundRateLimit = await rateLimitsCollection.findOne({
            ip,
            endpoint,
        });

        if (!foundRateLimit) {
            return null;
        }

        return foundRateLimit;
    },

    async createRateLimit(
        rateLimit: RateLimitType
    ): Promise<RateLimitType> {
        await rateLimitsCollection.insertOne(rateLimit);
        return rateLimit;
    },
    async updateCounter(
        ip: string,
        endpoint: string,
        attemptsCount: number,
        currentDate: number
    ): Promise<boolean> {
        const result = await rateLimitsCollection.updateOne(
            { ip, endpoint },
            {
                $set: {
                    attemptsCount,
                    lastAttempt: currentDate,
                },
            }
        );
        return result.matchedCount === 1;
    },
    async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
        const result = await rateLimitsCollection.deleteOne({ ip, endpoint });
        return result.deletedCount === 1;
    },
}