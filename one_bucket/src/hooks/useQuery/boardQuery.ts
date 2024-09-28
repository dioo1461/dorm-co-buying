import {
    getBoardList,
    getBoardPost,
    getBoardPostList,
} from '@/apis/boardService'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/success/board/GetBoardPostResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import {
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    useQuery,
    UseQueryOptions,
} from 'react-query'

export const queryBoardPost = (postId: number) => {
    return useQuery<GetBoardPostResponse>(['boardPost', postId], () =>
        getBoardPost(postId),
    )
}

type SortType = {
    sortType: 'title' | 'createdDate'
    sort: 'asc' | 'desc'
}

// TODO: 게시글 캐싱
// 게시글 목록 무한 스크롤 구현
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

export const queryBoardList = () => {
    // TODO: 캐싱 파라미터 수정
    return useQuery('boardList', getBoardList)
}
