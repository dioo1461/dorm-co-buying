export interface AddReplyCommentRequestBody {
    postId: number
    parentCommentId: number
    text: string
}
