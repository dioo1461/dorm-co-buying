export interface GetChatLogAfterTimestampRequestBody {
    id: string
    roomId: string
    sender: string
    message: string
    timestamp: Date
}