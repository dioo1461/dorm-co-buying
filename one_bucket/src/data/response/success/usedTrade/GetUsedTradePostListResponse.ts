import { TradeCategory } from '@/types/TradeCategory'
import {
    BoardPostReduced,
    GetBoardPostListResponse,
} from '../board/GetBoardPostListResponse'

export interface GetUsedTradePostListResponse
    extends Omit<GetBoardPostListResponse, 'content'> {
    content: UsedTradePostReduced[] // content의 타입을 확장된 것으로 변경
}

export interface UsedTradePostReduced extends BoardPostReduced {
    trade_id: number
    trade_item: string
    trade_price: number
    trade_location: string
    trade_linkUrl: string
    trade_tag: TradeCategory
    trade_userId: number
    trade_dueDate: Date
    trade_createAt: string // ISO 8601
    trade_updateAt: string | null // ISO 8601
    liftedAt: string // ISO 8601
    trade_fin: boolean
}
