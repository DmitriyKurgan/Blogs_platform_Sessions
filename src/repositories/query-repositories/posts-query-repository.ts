import {ObjectId, WithId} from "mongodb";
import {OutputPostType, PostType} from "../../utils/types";
import {getPostsFromDB} from "../../utils/utils";
import {postsCollection} from "../db";


export const PostMapper = (post : WithId<PostType>) : OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}
export const postsQueryRepository = {
    async findPostByID(postID:string):Promise<OutputPostType | null> {
        const post: WithId<PostType> | null = await postsCollection.findOne({_id: new ObjectId(postID)});
        return post ? PostMapper(post) : null
    },
    async getAllPosts(query:any):Promise<any | { error: string }> {
        return getPostsFromDB(query);
    },
    async findAllPostsByBlogID(blogID: string, query:any):Promise<any | { error: string }> {
        return getPostsFromDB(query, blogID)
    },
}
