import {refreshTokensBlacklistCollection} from "../db";
import {MongoRefreshTokenType} from "../../utils/types";

export const tokensQueryRepository = {
    async findBlackListedToken(token: string): Promise<MongoRefreshTokenType | null> {
        return await refreshTokensBlacklistCollection.findOne({
            refreshToken: token,
        });
    },
};