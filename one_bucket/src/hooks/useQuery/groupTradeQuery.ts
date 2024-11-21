import {
    getJoinedGroupTradePostList,
    getGroupTradePost,
    getGroupTradePostList,
    getMyGroupTradePostList,
    searchGroupTradePosts,
} from '@/apis/groupTradeService'
import { GetGroupTradePostListResponse } from '@/data/response/success/groupTrade/GetGroupTradePostListResponse'
import { GetGroupTradePostResponse } from '@/data/response/success/groupTrade/GetGroupTradePostResponse'
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

export const queryGroupTradePostList = (
    boardId: number,
    category: TradeCategory,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetGroupTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetGroupTradePostListResponse>(
        ['marketPostList', boardId, category, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getGroupTradePostList(boardId, pageParam, size, sortParam)
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

export const queryGroupTradePost = (
    postId: number,
    onSuccessCallback?: (data: GetGroupTradePostResponse) => void,
) => {
    return useQuery<GetGroupTradePostResponse>(
        ['marketPost', postId],
        () => getGroupTradePost(postId),
        {
            onSuccess: data => {
                if (onSuccessCallback) onSuccessCallback(data)
            },
        },
    )
}

export const querySearchGroupTradePosts = (
    boardId: number,
    keyword: string,
    option: 'title' | 'content' | 'titleAndContent',
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetGroupTradePostListResponse> = {},
    onSuccess?: () => void,
) => {
    return useInfiniteQuery<GetGroupTradePostListResponse>(
        ['searchGroupTradePosts', boardId, keyword, option, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return searchGroupTradePosts(
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

export const queryMyGroupTradePostList = (
    boardId: number,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetGroupTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetGroupTradePostListResponse>(
        ['marketPostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getMyGroupTradePostList(boardId, pageParam, size, sortParam)
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

export const queryJoinedGroupTradePostList = (
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetGroupTradePostListResponse> = {},
) => {
    return useInfiniteQuery<GetGroupTradePostListResponse>(
        ['marketPostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getJoinedGroupTradePostList(pageParam, size, sortParam)
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
