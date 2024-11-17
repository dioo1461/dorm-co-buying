export type TradeInfoOfChatRoom = {
    chatRoomId: string
    item: string
    wanted: number
    price: number
    count: number
    location: string
    linkUrl: string
    tag: string
    id: number
    userId: number
    dueDate: string // ISO 8601
    joins: number
    nickNames: string[]
    startTradeAt: string // ISO 8601
    fin: boolean
}
