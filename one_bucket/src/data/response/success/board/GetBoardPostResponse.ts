export interface GetBoardPostResponse {
    boardId: number
    title: string
    text: string
    postId: number
    authorNickname: string
    createdDate: Date
    modifiedDate: Date
    views: number
    likes: number
    imageUrls: string[]
    commentsCount: number
    comments: IComment[]
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
