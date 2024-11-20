export interface GetBoardListResponse extends Array<Board> {}

interface Board {
    id: number
    name: string
    type: 'post' | 'groupTradePost' | 'usedTradePost'
}
