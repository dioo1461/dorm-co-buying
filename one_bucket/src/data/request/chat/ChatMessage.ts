export interface WsChatMessageBody {
    type: 'TALK' | 'ENTER'
    roomId: string
    sender: string
    message: string
    timeStamp: string // ISO8601
}
