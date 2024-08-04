import {AccessToken, OutputUserType, TokenType} from "../utils/types";
import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {randomUUID, UUID} from "crypto";

export const jwtService:any = {

    async createJWT(user:OutputUserType):Promise<TokenType>{
        const deviceId:UUID = randomUUID();
        const accessToken: AccessToken = {
            accessToken: jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '10h' })
        };

        const refreshToken = jwt.sign({ userId: user.id, deviceId }, settings.JWT_SECRET, { expiresIn: '20h' })
        console.log('refreshToken: ', refreshToken)
        return { accessToken, refreshToken };
    },
    async getUserIdByToken(token:string):Promise<ObjectId | null>{
        console.log('getToken: , ' , token)
        try {
           const result:any = jwt.verify(token, settings.JWT_SECRET);
           return result.userId;
        } catch (e:unknown) {
            console.log(e)
            return null
        }
    },
    async verifyToken(token: string) {
        try {
            return jwt.verify(token, settings.JWT_SECRET)
        } catch (error) {
            console.log(error)
            return null;
        }
    },
    getLastActiveDateFromToken(refreshToken: string): string {
        console.log('refreshToken: ', refreshToken)
        const payload: any = jwt.decode(refreshToken)
        console.log('payload: ', payload)
        return new Date(payload.iat * 1000).toISOString()
    },
    getDeviceIdFromToken(refreshToken: string): string {
        console.log('refreshToken: ', refreshToken)
        const payload: any = jwt.decode(refreshToken)
        console.log('payload: ', payload)
        return payload.deviceId
    }
}