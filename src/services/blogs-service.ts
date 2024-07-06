import {BlogsServiceType, BLogType, OutputBlogType} from "../utils/types";
import {blogsRepository} from "../repositories/blogs-repository";
export const blogs = [] as BLogType[]

export const blogsService:BlogsServiceType = {

    async createBlog(body:BLogType):Promise<OutputBlogType | null> {
        const newBlog:BLogType = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog:OutputBlogType | null = await blogsRepository.createBlog(newBlog);
        return createdBlog;
    },
    async updateBlog(blogID:string, body:BLogType):Promise<boolean> {
        return await blogsRepository.updateBlog(blogID,body)
    },
   async deleteBlog(blogID:string): Promise<boolean>{
       return await blogsRepository.deleteBlog(blogID);
    }

}