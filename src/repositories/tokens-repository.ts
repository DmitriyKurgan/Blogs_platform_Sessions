import {MongoRefreshTokenType} from "../utils/types";
import {refreshTokensBlacklistCollection} from "./db";

export const blacklistedTokensRepository = {
    // Create new blacklisted token
    async createNewToken(
        newToken: MongoRefreshTokenType
    ): Promise<MongoRefreshTokenType> {
        await refreshTokensBlacklistCollection.insertOne(newToken);
        console.log('newToken: ', newToken)
        return newToken;
    },

    // Delete all blacklisted tokens
    async deleteAll(): Promise<boolean> {
        await refreshTokensBlacklistCollection.deleteMany({});
        return (await refreshTokensBlacklistCollection.countDocuments()) === 0;
    },
};