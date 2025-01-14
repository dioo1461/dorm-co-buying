import { TradeCategory } from '@/types/TradeCategory'
import {
    BoardPostReduced,
    GetBoardPostListResponse,
} from '../board/GetBoardPostListResponse'

export interface GetGroupTradePostListResponse
    extends Omit<GetBoardPostListResponse, 'content'> {
    content: GroupTradePostReduced[] // content의 타입을 확장된 것으로 변경
}

export interface GroupTradePostReduced extends BoardPostReduced {
    trade_id: number
    trade_item: string
    trade_wanted: number
    trade_joins: number
    trade_count: number
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
