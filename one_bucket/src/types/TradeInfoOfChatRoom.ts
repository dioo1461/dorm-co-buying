import { ColumnTypes } from '@/hooks/useDatabase/useDatabase'

export interface TradeInfoOfChatRoom {
    [key: string]: ColumnTypes
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
    dueDate: string
    joins: number
    nickNames: Object
    startTradeAt: string
    fin: boolean
}
