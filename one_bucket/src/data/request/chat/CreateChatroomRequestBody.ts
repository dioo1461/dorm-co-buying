export interface CreateChatroomRequestBody {
    name: string
    createdAt: string
    createdBy: string
    members: { nickname: string }[]
    maxMembers: number
}
