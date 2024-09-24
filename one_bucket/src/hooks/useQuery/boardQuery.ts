import {
    getBoardList,
    getBoardPost,
    getBoardPostList,
} from '@/apis/boardService'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/success/board/GetBoardPostResponse'
import { useQuery, UseQueryOptions } from 'react-query'

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
export const queryBoardPostList = (
    boardId: number,
    page: number,
    sortType: SortType,
    size = 10,
    options: UseQueryOptions = {},
) => {
    return useQuery<GetBoardPostListResponse>(
        ['boardPostList', boardId, page, size, sortType],
        () => {
            if (sortType.sortType === 'title') {
                return getBoardPostList(boardId, page, size, [
                    `title,${sortType.sort}`,
                    `createdDate,${sortType.sort}`,
                ])
            }
            return getBoardPostList(boardId, page, size, [
                `createdDate,${sortType.sort}`,
                `title,${sortType.sort}`,
            ])
        },
    )
}

export const queryBoardList = () => {
    // TODO: 캐싱 파라미터 수정
    return useQuery('boardList', getBoardList)
}
