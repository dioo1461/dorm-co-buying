import { CreateUsedTradePostRequestBody } from '@/data/request/usedTrade/CreateUsedTradePostRequestBody'
import { UpdateUsedTradePostRequestBody } from '@/data/request/usedTrade/UpdateUsedTradePostRequestBody'
import { CreateUsedTradePostResponse } from '@/data/response/success/usedTrade/CreateUsedTradePostResponse'
import { GetUsedTradePostListResponse } from '@/data/response/success/usedTrade/GetUsedTradePostListResponse'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { GetUsedTradePostResponse } from '@/data/response/success/usedTrade/GetUsedTradePostResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const USED_TRADE_POST_ENDPOINT_PREFIX = '/used-post'
const USED_TRADE_ENDPOINT_PREFIX = '/used-trade'

// ########## GET ##########

export const getUsedTradePostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetUsedTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${USED_TRADE_POST_ENDPOINT_PREFIX}/list/${boardId}`, {
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
            console.log('getUsedTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getUsedTradePost = async (
    postId: number,
): Promise<GetUsedTradePostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${USED_TRADE_POST_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('getUsedTradePost - ' + err)
        })
}

export const getMyUsedTradePostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetUsedTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${USED_TRADE_POST_ENDPOINT_PREFIX}/list/my/${boardId}`, {
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
            console.log('getMyUsedTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getJoinedUsedTradePostList = async (
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetUsedTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${USED_TRADE_POST_ENDPOINT_PREFIX}/list/joins`, {
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
            console.log('getJoinedUsedTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const searchUsedTradePosts = async (
    boardId: number,
    keyword: string,
    option: 'title' | 'content' | 'titleAndContent',
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetUsedTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    const optionNumber = option === 'title' ? 1 : option === 'content' ? 2 : 3
    return authAxios
        .get(`${USED_TRADE_POST_ENDPOINT_PREFIX}/search`, {
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
            console.log('searchUsedTradePosts - ' + error)
            throw error
        })
}

// ########## POST ##########

export const createUsedTradePost = async (
    data: CreateUsedTradePostRequestBody,
): Promise<CreateUsedTradePostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`${USED_TRADE_POST_ENDPOINT_PREFIX}/create`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('createUsedTradePost - ' + err)
        })
}

export const updateUsedTradePost = async (
    data: UpdateUsedTradePostRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .put(`${USED_TRADE_POST_ENDPOINT_PREFIX}/update`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('updateUsedTradePost - ' + err)
        })
}

export const saveUsedTradePostImage = async (
    postId: number,
    data: FormData,
) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`${USED_TRADE_POST_ENDPOINT_PREFIX}/save/image/${postId}`, data)
        .then(res => {
            console.log('saveImage Success', res.data)
            return res.data
        })
        .catch(err => {
            console.log(`saveImage Error - ${err}`)
            throw err
        })
}

export const updateUsedTradePostImageReset = async (
    postId: number,
    data: any,
) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(
            `${USED_TRADE_POST_ENDPOINT_PREFIX}/update/image/update/${postId}`,
            data,
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateUsedTradePostImageReset : update Error - ${err}`)
            throw err
        })
}

export const updateUsedTradePostImageAdd = async (
    postId: number,
    data: any,
) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(
            `${USED_TRADE_POST_ENDPOINT_PREFIX}/update/image/add/${postId}`,
            data,
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateUsedTradePostImageAdd : add Error - ${err}`)
            throw err
        })
}

export const updateUsedTradePostImageDelete = async (
    postId: number,
    data: any,
) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(
            `${USED_TRADE_POST_ENDPOINT_PREFIX}/update/image/delete/${postId}`,
            data,
        )
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(
                `updateUsedTradePostImageDelete : delete Error - ${err}`,
            )
            throw err
        })
}

export const createUsedTradeChat = async (usedTradePostId: number) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`${USED_TRADE_ENDPOINT_PREFIX}/chat/${usedTradePostId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('createUsedTradeChat - ' + err)
            throw err
        })
}

// ########## DELETE ##########

export const deleteUsedTradePost = async (postId: number): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`${USED_TRADE_POST_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deleteUsedTradePost - ' + err)
        })
}

// ########## LIKE ##########

export const addLike = async (postId: number): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`${USED_TRADE_POST_ENDPOINT_PREFIX}/${postId}/like`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('addLike - ' + err)
            throw err
        })
}

export const deleteLike = async (
    postId: number,
): Promise<{ message: string }> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`${USED_TRADE_POST_ENDPOINT_PREFIX}/${postId}/like`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deleteLike - ' + err)
            throw err
        })
}
