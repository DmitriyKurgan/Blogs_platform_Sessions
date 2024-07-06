import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import {BLogType, CommentType, MongoRefreshTokenType, PostType, SessionType, UserDBType} from "../utils/types";
dotenv.config()

const mongoURI = process.env.MONGO_URL || "mongodb+srv://dimas:bdsPqKEj9AFZXz3n@blogsplatform.mxifx0s.mongodb.net/?retryWrites=true&w=majority&appName=BlogsPlatform"
if (!mongoURI){
    throw new Error('Database url is not defined!')
}
export const client = new MongoClient(mongoURI);
export const blogsCollection =  client.db('learning').collection<BLogType>('blogs')
export const postsCollection =  client.db('learning').collection<PostType>('posts')
export const usersCollection =  client.db('learning').collection<UserDBType>('users')
export const commentsCollection =  client.db('learning').collection<CommentType>('comments')
export const sessionsCollection =  client.db('learning').collection<SessionType>('sessions')
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