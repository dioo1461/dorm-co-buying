import { Member } from '@/data/common/Member'

export interface GetChatRoomTradeInfoResponse {
    chatRoom: {
        roomId: string
        name: string
        ownerId: number
        membersInfo: Member[]
        tradeType: 'GROUP'
        tradeId: number
    }
    trade: {
        id: number
        item: string
        price: number
        location: string
        userId: number
        wanted: number
        count: number
        linkUrl: string
        tag: string
        dueDate: string
        joins: number
        joinMember: Member[]
        startTradeAt: string
        chatRoomId: string
        fin: boolean
    }
}
