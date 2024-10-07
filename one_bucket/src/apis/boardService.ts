import { AddCommentRequestBody } from '@/data/request/board/AddCommentRequestBody'
import { AddReplyCommentRequestBody } from '@/data/request/board/AddReplyCommentRequestBody'
import { CreateBoardPostRequestBody } from '@/data/request/board/CreateBoardPostRequestBody'
import { GetBoardListResponse } from '@/data/response/success/board/GetBoardListResponse'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/success/board/GetBoardPostResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */

export const getBoardList = async (): Promise<GetBoardListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get('/board/list')
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('getBoardList - ' + error)
            throw error
        })
}

export const createBoardPost = async (
    data: CreateBoardPostRequestBody,
): Promise<CreateBoardPostRequestBody> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/post/create', data)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('createBoardPost - ' + error)
            // 401 unauthorized
            if (error.response.status === 401 || 403) {
                // onLogOut(false)
            }
            throw error
        })
}

export const getBoardPost = async (
    postId: number,
): Promise<GetBoardPostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/post/${postId}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('getBoardPost - ' + error.response)
            // console.log(postId)
            throw error
        })
}

export const getBoardPostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetBoardPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/post/list/${boardId}`, {
            params: {
                page: page,
                size: size,
                sort: sortParams[0],
                // sort: sortParams[1],
            },
        })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('getBoardPost - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const addComment = async (
    data: AddCommentRequestBody,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/comment', data)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('addComment - ' + error)
            throw error
        })
}

export const addReplyComment = async (
    data: AddReplyCommentRequestBody,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/comment', data)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('addReplyComment - ' + error)
            throw error
        })
}
