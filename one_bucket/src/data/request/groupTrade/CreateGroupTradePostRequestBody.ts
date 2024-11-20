import { TradeCategory } from '@/types/TradeCategory'

export interface CreateGroupTradePostRequestBody {
    post: {
        boardId: number
        title: string
        text: string
    }
    trade: {
        item: string
        price: number
        location: string
        linkUrl: string
        tag: TradeCategory
        dueDate: number
        wanted: number
        count: number
    }
    chatRoomName: string
}
