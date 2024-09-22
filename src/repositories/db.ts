import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import {
    BLogType,
    CommentType,
    DeviceType,
    MongoRefreshTokenType,
    PostType, RateLimitType,
    RequestType,
    UserDBType
} from "../utils/types";
dotenv.config()
const mongoURI = process.env.MONGO_URL || "mongodb+srv://dimas:jcm9I93KGt526fpO@blogsplatform.mxifx0s.mongodb.net/?retryWrites=true&w=majority&appName=BlogsPlatform"
console.log('mongoURI: ', mongoURI)
if (!mongoURI){
    throw new Error('Database url is not defined!')
}
export const client = new MongoClient(mongoURI);
export const blogsCollection =  client.db('learning').collection<BLogType>('blogs')
export const postsCollection =  client.db('learning').collection<PostType>('posts')
export const usersCollection =  client.db('learning').collection<UserDBType>('users')
export const commentsCollection =  client.db('learning').collection<CommentType>('comments')
export const devicesCollection =  client.db('learning').collection<DeviceType>('devices')
export const requestsCollection = client.db('learning').collection<RequestType>('requests');
export const rateLimitsCollection = client.db('learning').collection<RateLimitType>('rate-limits');
export const refreshTokensBlacklistCollection =  client.db('learning').collection<MongoRefreshTokenType>("refresh-tokens-blacklist");
export async function runDB (){
    try {
        await client.connect();
        await client.db('learning').command({ping:1});
        console.log('Successfully connected to server');
    } catch (error) {
        console.log(error)
        console.log('Problem with connection to DB');
        await client.close();
    }
}