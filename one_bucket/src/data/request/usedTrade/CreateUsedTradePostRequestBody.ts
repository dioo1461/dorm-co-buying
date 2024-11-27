import { TradeCategory } from '@/types/TradeCategory'

export interface CreateUsedTradePostRequestBody {
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
        tag: string
        dueDate: number
    }
}
