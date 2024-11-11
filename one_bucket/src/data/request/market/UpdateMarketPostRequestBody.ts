export interface UpdateMarketPostRequestBody {
    marketPostUpdateDto: {
        title: string
        text: string
        postId: number
    }
    tradeUpdateDto: {
        tradeId: number
        item: string
        wanted: number
        price: number
        count: number
        location: string
        linkUrl: string
        tag: string
        dueDays: number
    }
}
