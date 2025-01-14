import { AddCommentRequestBody } from '@/data/request/board/AddCommentRequestBody'
import { AddReplyCommentRequestBody } from '@/data/request/board/AddReplyCommentRequestBody'
import { CreateBoardPostRequestBody } from '@/data/request/board/CreateBoardPostRequestBody'
import { SaveImageRequestBody } from '@/data/request/board/SaveImageRequestBody'
import { UpdateBoardPostRequestBody } from '@/data/request/board/UpdateBoardPostRequestBody'
import { CreateBoardPostResponse } from '@/data/response/success/board/CreateBoardResponse'
import { GetBoardListResponse } from '@/data/response/success/board/GetBoardListResponse'
import { GetBoardPostListResponse } from '@/data/response/success/board/GetBoardPostListResponse'
import { GetBoardPostResponse } from '@/data/response/success/board/GetBoardPostResponse'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { createAuthAxios, createAxios } from '@/utils/axiosFactory'

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */

// ########## GET ##########
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
            console.log('getBoardPostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getAnnouncPostList = async (): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/notice/list`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('getAnnouncPostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getAnnouncPost = async (id: number): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/notice/${id}`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('getAnnouncPost - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getMyBoardPostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetBoardPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/post/list/my/${boardId}`, {
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
            console.log('getMyBoardPost - ' + error)
            // console.log(error.response)
            throw error
        })
}

export const getMyLikedPostList = async (
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetBoardPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/post/list/likes`, {
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
            console.log('getMyBoardPost - ' + error)
            // console.log(error.response)
            throw error
        })
}

export const searchBoardPosts = async (
    boardId: number,
    keyword: string,
    option: 'title' | 'content' | 'titleAndContent',
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetBoardPostListResponse> => {
    const authAxios = await createAuthAxios()
    const optionNumber = option === 'title' ? 1 : option === 'content' ? 2 : 3
    return authAxios
        .get(`/post/search`, {
            params: {
                boardId: boardId,
                keyword: keyword,
                option: optionNumber,
                page: page,
                size: size,
                sort: sortParams[0],
            },
        })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('searchPosts - ' + error)
            throw error
        })
}

// ########## POST ##########

export const createBoardPost = async (
    data: CreateBoardPostRequestBody,
): Promise<CreateBoardPostResponse> => {
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

export const updateBoardPost = async (
    data: UpdateBoardPostRequestBody,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`/post/update`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('updatePost - ' + err)
            throw err
        })
}

export const saveBoardPostImage = async (postId: number, data: FormData) => {
    const token = await getAccessToken()
    const axios = createAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return axios
        .post(`/post/save/image/${postId}`, data)
        .then(res => {
            console.log('saveImage Success', res.data)
            return res.data
        })
        .catch(err => {
            console.log(`saveImage Error - ${err}`)
            throw err
        })
}

export const updatePostImageReset = async (postId: number, data: any) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`/post/update/image/update/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateImage : update Error - ${err}`)
            throw err
        })
}

export const updatePostImageAdd = async (postId: number, data: any) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`/post/update/image/add/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateImage : add Error - ${err}`)
            throw err
        })
}

export const updatePostImageDelete = async (postId: number) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`/post/update/image/delete/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateImage : delete Error - ${err}`)
            throw err
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

export const addLike = async (postId: number): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`/post/${postId}/like`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('addLike - ' + err)
            throw err
        })
}

// ########## DELETE ##########

export const deletePost = async (
    postId: number,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`/post/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deletePost - ' + err)
            throw err
        })
}

export const deleteLike = async (
    postId: number,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`/post/${postId}/like`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deleteLike - ' + err)
            throw err
        })
}
