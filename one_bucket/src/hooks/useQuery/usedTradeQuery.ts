import {
    getJoinedUsedTradePostList,
    getMyUsedTradePostList,
    getUsedTradePost,
    getUsedTradePostList,
    searchUsedTradePosts,
} from '@/apis/usedTradeService'
import { GetUsedTradePostListResponse } from '@/data/response/success/usedTrade/GetUsedTradePostListResponse'
import { GetUsedTradePostResponse } from '@/data/response/success/usedTrade/GetUsedTradePostResponse'
import { TradeCategory } from '@/types/TradeCategory'
import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    useQuery,
} from 'react-query'

type SortType = {
    sortType: 'title' | 'createdDate'
    sort: 'asc' | 'desc'
}

export const queryUsedTradePostList = (
    boardId: number,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetUsedTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetUsedTradePostListResponse>(
        ['usedTradePostList', boardId, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getUsedTradePostList(boardId, pageParam, size, sortParam)
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.pageable.pageNumber + 1 < lastPage.totalPages) {
                    return lastPage.pageable.pageNumber + 1 // 다음 페이지가 있으면 페이지 번호 반환
                }
                return null // 더 이상 페이지가 없으면 null 반환
            },
            ...options,
        },
    )
}

export const queryUsedTradePost = (
    postId: number,
    onSuccessCallback?: (data: GetUsedTradePostResponse) => void,
) => {
    return useQuery<GetUsedTradePostResponse>(
        ['usedTradePost', postId],
        () => getUsedTradePost(postId),
        {
            onSuccess: data => {
                if (onSuccessCallback) onSuccessCallback(data)
            },
        },
    )
}

export const querySearchUsedTradePosts = (
    boardId: number,
    keyword: string,
    option: 'titleAndContent' | 'title' | 'content',
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetUsedTradePostListResponse> = {},
    onSuccess?: () => void,
) => {
    return useInfiniteQuery<GetUsedTradePostListResponse>(
        ['searchUsedTradePosts', boardId, keyword, option, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return searchUsedTradePosts(
                boardId,
                keyword,
                option,
                pageParam,
                size,
                sortParam,
            )
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.pageable.pageNumber + 1 < lastPage.totalPages) {
                    return lastPage.pageable.pageNumber + 1 // 다음 페이지가 있으면 페이지 번호 반환
                }
                return null // 더 이상 페이지가 없으면 null 반환
            },
            onSuccess: () => onSuccess && onSuccess(),
            ...options,
        },
    )
}

export const queryMyUsedTradePostList = (
    boardId: number,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetUsedTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetUsedTradePostListResponse>(
        ['usedTradePostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getMyUsedTradePostList(boardId, pageParam, size, sortParam)
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.pageable.pageNumber + 1 < lastPage.totalPages) {
                    return lastPage.pageable.pageNumber + 1 // 다음 페이지가 있으면 페이지 번호 반환
                }
                return null // 더 이상 페이지가 없으면 null 반환
            },
            ...options,
        },
    )
}

export const queryJoinedUsedTradePostList = (
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetUsedTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetUsedTradePostListResponse>(
        ['usedTradePostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getJoinedUsedTradePostList(pageParam, size, sortParam)
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.pageable.pageNumber + 1 < lastPage.totalPages) {
                    return lastPage.pageable.pageNumber + 1 // 다음 페이지가 있으면 페이지 번호 반환
                }
                return null // 더 이상 페이지가 없으면 null 반환
            },
            ...options,
        },
    )
}
