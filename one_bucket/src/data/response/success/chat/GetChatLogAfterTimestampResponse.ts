export interface GetChatLogAfterTimestampResponse extends Array<ChatLog> {}

interface ChatLog {
    id: string
    roomId: string
    sender: string
    message: string
    timestamp: string
}