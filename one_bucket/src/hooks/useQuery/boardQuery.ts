import {
    getBoardPost,
    getBoardPostList,
    getMyBoardPostList,
    searchBoardPosts,
} from '@/apis/boardService'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/success/board/GetBoardPostResponse'
import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    useQuery,
} from 'react-query'

export const queryBoardPost = (
    postId: number,
    onSuccessCallback?: (data: GetBoardPostResponse) => void,
) => {
    return useQuery<GetBoardPostResponse>(
        ['boardPost', postId],
        () => getBoardPost(postId),
        {
            // 유저가 이미 좋아요를 눌렀는지에 대해,
            // boardPost의 userLiked state를 true/false 로 set
            onSuccess: data => {
                if (onSuccessCallback) onSuccessCallback(data)
            },
        },
    )
}

type SortType = {
    sortType: 'title' | 'createdDate'
    sort: 'asc' | 'desc'
}

export const queryBoardPostList = (
    boardId: number,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetBoardPostListResponse> = {},
) => {
    return useInfiniteQuery<GetBoardPostListResponse>(
        ['boardPostList', boardId, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getBoardPostList(boardId, pageParam, size, sortParam)
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

export const querySearchBoardPosts = (
    boardId: number,
    keyword: string,
    option: 'titleAndContent' | 'title' | 'content' ,
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetBoardPostListResponse> = {},
) => {
    return useInfiniteQuery<GetBoardPostListResponse>(
        ['searchBoardPosts', boardId, sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return searchBoardPosts(
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
            ...options,
        },
    )
}

export const queryMyBoardPostList = (
    sortType: SortType,
    size = 5,
    options: UseInfiniteQueryOptions<GetBoardPostListResponse> = {},
) => {
    return useInfiniteQuery<GetBoardPostListResponse>(
        ['myBoardPostList', sortType],
        // 데이터를 페이지 단위로 가져오기 위한 함수
        ({ pageParam = 0 }) => {
            console.log('pageParam', pageParam)
            const sortParam =
                sortType.sortType === 'title'
                    ? [`title,${sortType.sort}`, `createdDate,${sortType.sort}`]
                    : [`createdDate,${sortType.sort}`, `title,${sortType.sort}`]

            return getMyBoardPostList(pageParam, size, sortParam)
        },
        {
            getNextPageParam: (lastPage, allPages) => {
                console.log('lastPage-pagenumber', lastPage.pageable.pageNumber)
                console.log('lastPage-totalPages', lastPage.totalPages)
                if (lastPage.pageable.pageNumber + 1 < lastPage.totalPages) {
                    return lastPage.pageable.pageNumber + 1 // 다음 페이지가 있으면 페이지 번호 반환
                }
                return null // 더 이상 페이지가 없으면 null 반환
            },
            ...options,
        },
    )
}
