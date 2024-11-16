export interface GetChatRoomListResponse extends Array<ChatRoom> {}

export interface ChatRoom {
    roomId: string
    roomName: string
    memberCount: number
    stackMessage: number
    recentMessage: string
    recentMessageTime: Date
    ownerId: number
}
