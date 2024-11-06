export interface WsChatMessageBody {
    type: 'TALK' | 'ENTER' | 'IMAGE' | 'LEAVE'
    roomId: string
    sender: string
    message: string
    time: string // ISO8601
}
