import {
    getJoinedMarketPostList,
    getMarketPost,
    getMarketPostList,
    getMyMarketPostList,
} from '@/apis/marketService'
import { GetMarketPostListResponse } from '@/data/response/success/market/GetMarketPostListResponse'
import { GetMarketPostResponse } from '@/data/response/success/market/GetMarketPostResponse'
import { TMarketCategory } from '@/types/TMarketCategory'
import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    useQuery,
} from 'react-query'

type SortType = {
    sortType: 'title' | 'createdDate'
    sort: 'asc' | 'desc'
}

export const queryMarketPostList = (
    boardId: number,
    category: TMarketCategory,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetMarketPostListResponse> = {},
) => {
    return useInfiniteQuery<GetMarketPostListResponse>(
        ['marketPostList', boardId, category, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getMarketPostList(boardId, pageParam, size, sortParam)
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

export const queryMarketPost = (
    postId: number,
    onSuccessCallback?: (data: GetMarketPostResponse) => void,
) => {
    return useQuery<GetMarketPostResponse>(
        ['marketPost', postId],
        () => getMarketPost(postId),
        {
            onSuccess: data => {
                if (onSuccessCallback) onSuccessCallback(data)
            },
        },
    )
}

export const queryMyMarketPostList = (
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetMarketPostListResponse> = {},
) => {
    return useInfiniteQuery<GetMarketPostListResponse>(
        ['marketPostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getMyMarketPostList(pageParam, size, sortParam)
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

export const queryJoinedMarketPostList = (
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetMarketPostListResponse> = {},
) => {
    return useInfiniteQuery<GetMarketPostListResponse>(
        ['marketPostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getJoinedMarketPostList(pageParam, size, sortParam)
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
