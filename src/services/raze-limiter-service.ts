import {ObjectId} from "mongodb";
import {rateLimitsRepository} from "../repositories/rate-limit-repository.ts";

export const rateLimitsService = {
    async findRateLimit(
        ip: string,
        endpoint: string
    ): Promise<any | null> {
        return rateLimitsRepository.findRateLimit(ip, endpoint);
    },
    async createRateLimit(
        ip: string,
        endpoint: string
    ): Promise<any> {
        const newRateLimit ={
            _id: new ObjectId(),
            ip,
            endpoint,
            firstAttempt: Date.now(),
            lastAttempt: Date.now(),
            attemptsCount: 1
        }
        return rateLimitsRepository.createRateLimit(newRateLimit);
    },
    async updateCounter(
        ip: string,
        endpoint: string,
        currentDate: number
    ): Promise<boolean> {
        const rateLimit = await rateLimitsRepository.findRateLimit(
            ip,
            endpoint
        );

        if (!rateLimit) {
            return false;
        }

        const attemptsCount = rateLimit.attemptsCount + 1;

        return rateLimitsRepository.updateCounter(
            ip,
            endpoint,
            attemptsCount,
            currentDate
        );
    },
    async deleteRateLimit(ip: string, endpoint: string): Promise<boolean> {
        return rateLimitsRepository.deleteRateLimit(ip, endpoint);
    }
}