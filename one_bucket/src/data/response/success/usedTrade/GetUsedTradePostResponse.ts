import { TradeCategory } from '@/types/TradeCategory'
import { GetBoardPostResponse } from '../board/GetBoardPostResponse'
import { Member } from '@/data/common/Member'

export interface GetUsedTradePostResponse extends GetBoardPostResponse {
    trade_id: number
    trade_item: string
    trade_price: number
    trade_location: string
    trade_linkUrl: string
    trade_tag: TradeCategory
    trade_userId: number
    trade_dueDate: string // ISO8601
    trade_createAt: string // ISO8601
    trade_updateAt: string | null
    trade_fin: boolean
}
