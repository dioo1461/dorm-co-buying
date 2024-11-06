export interface WsChatMessageBody {
    type: 'TALK' | 'ENTER'
    roomId: string
    sender: string
    message: string
    time: string // ISO8601
}
