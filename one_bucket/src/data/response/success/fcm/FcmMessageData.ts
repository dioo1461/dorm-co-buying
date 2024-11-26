export interface FcmMessageData {
    title: string
    body: string
    type: 'CHAT' | 'COMMENT' | 'TRADE' | 'ALL' | 'WARNING'
    id: string
}
