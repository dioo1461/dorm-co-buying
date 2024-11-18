import { TMarketCategory } from '@/types/TMarketCategory'
import {
    BoardPostReduced,
    GetBoardPostListResponse,
} from '../board/GetBoardPostListResponse'

export interface GetMarketPostListResponse
    extends Omit<GetBoardPostListResponse, 'content'> {
    content: MarketPostReduced[] // content의 타입을 확장된 것으로 변경
}

export interface MarketPostReduced extends BoardPostReduced {
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
