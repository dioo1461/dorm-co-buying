export interface CreateMarketPostRequestBody {
    boardId: number
    title: string
    text: string
    item: string
    wanted: number
    price: number
    count: number
    location: string
    linkUrl: string
    tag: string
    dueDays: number
}

export type MarketCategory =
    | '가공식품'
    | '기타'
    | '신선식품'
    | '음료/물'
    | '의약폼'
    | '일회용품'
    | '전자기기'
    | '쿠폰'
