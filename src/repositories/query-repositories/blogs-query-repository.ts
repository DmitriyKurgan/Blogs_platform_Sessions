import {BLogType, OutputBlogType} from "../../utils/types";
import {ObjectId, WithId} from "mongodb";
import {getBlogsFromDB} from "../../utils/utils";
import {blogsCollection} from "../db";


export const BLogMapper = (blog : WithId<BLogType>) : OutputBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}


export const blogsQueryRepository = {
    async findBlogByID(blogID:string):Promise<OutputBlogType | null> {
        const blog: WithId<BLogType> | null = await blogsCollection.findOne({_id: new ObjectId(blogID)});
        return blog ? BLogMapper(blog) : null
    },
    async getAllBlogs(query:any):Promise<any | { error: string }> {
        return getBlogsFromDB(query);
    },
}
