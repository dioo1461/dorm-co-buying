import { Member } from '@/data/common/Member'

export interface GetChatRoomInfoResponse {
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
        createAt: string // ISO 8601
        updateAt: string // ISO 8601
        chatRoomId: string
        fin: boolean
    }
}
