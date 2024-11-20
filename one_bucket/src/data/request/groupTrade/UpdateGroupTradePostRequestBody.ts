import { TradeCategory } from '@/types/TradeCategory'

export interface UpdateGroupTradePostRequestBody {
    post: {
        postId: number
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
}
