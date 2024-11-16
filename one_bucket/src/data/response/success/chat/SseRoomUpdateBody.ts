export interface SseRoomUpdateBody {
    roomId: string
    recentMessage: string
    recentMessageTime: string // ISO 8601
}
