export interface GetBoardPostListResponse {
    totalPages: number
    totalElements: number
    size: number
    content: BoardPostReduced[]
    number: number
    sort: Sort
    first: boolean
    last: boolean
    numberOfElements: number
    pageable: Pageable
    empty: boolean
}

export interface BoardPostReduced {
    boardId: number
    title: string
    text: string
    postId: number
    authorId: number
    authorNickname: string
    createdDate: string // ISO8601
    modifiedDate: string // ISO8601
    views: number
    likes: number
    commentsCount: number
    imageUrls: string[]
}

interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    paged: boolean
    unpaged: boolean
}

interface Sort {
    empty: boolean
    sorted: boolean
    unsorted: boolean
}
