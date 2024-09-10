export interface GetRoomsForMemberResponse extends Array<ChatRoom> {}

export interface ChatRoom {
    roomId: string
    name: string
    createdAt: string
    createdBy: string
    members: { nickname: string }[]
    messages: Message[]
    maxMembers: number
}

interface Message {}
