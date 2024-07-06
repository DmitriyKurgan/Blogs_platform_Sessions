import {OutputPostType, PostsServiceType, PostType} from "../utils/types";
import {postsRepository} from "../repositories/posts-repository";
export const posts = [] as PostType[]

export const postsService: PostsServiceType = {
   async createPost(body:PostType, blogName:string,blogID:string):Promise<OutputPostType | null> {
        const newPost:PostType = {
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId ?? blogID,
            blogName,
            createdAt: new Date().toISOString()
        }
       const createdPost: OutputPostType | null = await postsRepository.createPost(newPost);
       return createdPost

    },
   async updatePost(postID:string, body:PostType): Promise<boolean> {
       return await postsRepository.updatePost(postID,body);
    },
   async deletePost(postID:string){
       return await postsRepository.deletePost(postID);
    }

}