export interface CreateMarketPostRequestBody {
    marketPostCreateDto: {
        boardId: number
        title: string
        text: string
    }
    tradeCreateDto: {
        item: string
        wanted: number
        price: number
        count: number
        location: string
        linkUrl: string
        tag: string
        dueDays: number
    }
    chatRoomName: string
}
