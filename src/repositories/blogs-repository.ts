import {blogsCollection} from "../repositories/db";
import {InsertOneResult, ObjectId, UpdateResult, DeleteResult} from "mongodb";
import {BLogType, OutputBlogType} from "../utils/types";
import {BLogMapper} from "./query-repositories/blogs-query-repository";
export const blogs = [] as BLogType[]


export const blogsRepository = {
    async createBlog(newBlog:BLogType):Promise<OutputBlogType | null> {
        const result:InsertOneResult<BLogType> = await blogsCollection.insertOne(newBlog);
        const blog = await blogsCollection.findOne({_id: result.insertedId});
        return blog ? BLogMapper(blog) : null;
    },
    async updateBlog(blogID:string, body:BLogType):Promise<boolean> {
        const result: UpdateResult<BLogType>= await blogsCollection.updateOne({_id: new ObjectId(blogID)},
            {$set:{name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
            }}
        );
        return result.matchedCount === 1;
    },
   async deleteBlog(blogID:string): Promise<boolean>{
        const result: DeleteResult = await blogsCollection.deleteOne({_id:new ObjectId(blogID)});
        return result.deletedCount === 1
    }
}