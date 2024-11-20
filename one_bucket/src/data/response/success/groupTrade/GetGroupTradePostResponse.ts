import { TradeCategory } from '@/types/TradeCategory'
import { GetBoardPostResponse } from '../board/GetBoardPostResponse'
import { Member } from '@/data/common/Member'

export interface GetGroupTradePostResponse extends GetBoardPostResponse {
    trade_id: number
    trade_item: string
    trade_wanted: number
    trade_price: number
    trade_count: number
    trade_location: string
    trade_linkUrl: string
    trade_tag: TradeCategory
    trade_userId: number
    trade_dueDate: string // ISO8601
    trade_joins: number
    trade_joinMember: Member[]
    trade_createAt: string // ISO8601
    trade_updateAt: string | null
    trade_chatRoomId: string
    trade_fin: boolean
}
