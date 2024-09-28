export interface GetBoardPostResponse {
    boardId: number
    title: string
    text: string
    postId: number
    authorNickname: string
    createdDate: string
    modifiedDate: string
    views: number
    likes: number
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
