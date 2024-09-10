export interface GetBoardPostResponse {
    boardId: number
    title: string
    text: string
    postId: number
    authorNickname: string
    createdDate: string
    modifiedDate: string
    comments: []
}
