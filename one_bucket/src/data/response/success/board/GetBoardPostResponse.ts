export interface GetBoardPostResponse {
    boardId: number
    title: string
    text: string
    postId: number
    authorId: number
    authorNickname: string
    createdDate: string // ISO 8601
    modifiedDate: string // ISO 8601
    imageUrls: string[]
    views: number
    likes: number
    comments: IComment[]
    commentsCount: number
    userAlreadyLikes: boolean
}

export interface IComment {
    text: string
    postId: number
    commentId: number
    authorNickname: string
    modifiedDate: string
    replies: IComment[]
}
