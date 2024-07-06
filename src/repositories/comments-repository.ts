import {commentsCollection} from "../repositories/db";
import {ObjectId, WithId, InsertOneResult, UpdateResult, DeleteResult} from "mongodb";
import {CommentType, OutputCommentType, PostType} from "../utils/types";
import {CommentMapper} from "./query-repositories/comments-query-repository";
export const comments = [] as PostType[]

export const commentsRepository = {
   async createComment(newComment:CommentType):Promise<OutputCommentType | null> {
       const result:InsertOneResult<CommentType> = await commentsCollection.insertOne(newComment)
       const comment:WithId<CommentType> | null = await commentsCollection.findOne({_id:result.insertedId})
       return comment ? CommentMapper(comment) : null
    },
   async updateComment(commentID:string, body:CommentType): Promise<boolean> {
        const result: UpdateResult<CommentType> = await commentsCollection
            .updateOne({_id: new ObjectId(commentID)},
            {$set: {
                    ...body,
                    content: body.content,
                    postId:body.postId
                }});
       return result.matchedCount === 1
    },
   async deleteComment(commentID:string){

        const result: DeleteResult = await commentsCollection.deleteOne({_id: new ObjectId(commentID)})

       return result.deletedCount === 1
    }

}