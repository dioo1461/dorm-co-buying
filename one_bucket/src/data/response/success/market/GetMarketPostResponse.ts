import { TMarketCategory } from '@/types/TMarketCategory'
import { GetBoardPostResponse } from '../board/GetBoardPostResponse'

export interface GetMarketPostResponse extends GetBoardPostResponse {
    trade_id: number
    trade_item: string
    trade_wanted: number
    trade_price: number
    trade_count: number
    trade_location: string
    trade_linkUrl: string
    trade_tag: TMarketCategory
    trade_userId: number
    trade_dueDate: Date
    trade_joins: any
    trade_nickNames: string[]
    trade_startTradeAt: string
    trade_fin: boolean
}
