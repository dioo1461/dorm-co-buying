export interface AddCommentRequestBody {
    text: string
    postId: number
    parentCommentId?: number
}
