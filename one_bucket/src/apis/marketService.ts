import { CreateMarketPostRequestBody } from '@/data/request/market/CreateMarketPostBody'
import { UpdateMarketPostRequestBody } from '@/data/request/market/UpdateMarketPostRequestBody'
import { CreateMarketPostResponse } from '@/data/response/success/board/CreateMarketPostResponse'
import { GetMarketPostListResponse } from '@/data/response/success/market/GetMarketPostListResponse'
import { GetMarketPostResponse } from '@/data/response/success/market/GetMarketPostResponse'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { createAuthAxios } from '@/utils/axiosFactory'

const MARKET_ENDPOINT_PREFIX = '/market-post'

// ########## GET ##########

export const getMarketPostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetMarketPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/list/${boardId}`, {
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

export const getMarketPost = async (
    postId: number,
): Promise<GetMarketPostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('getMarketPost - ' + err)
        })
}

export const getMyMarketPostList = async (
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetMarketPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/list/my`, {
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

// ########## POST ##########

export const createMarketPost = async (
    data: CreateMarketPostRequestBody,
): Promise<CreateMarketPostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`${MARKET_ENDPOINT_PREFIX}/create`, data)
        .then(res => {
            return res.data
        })
    // .catch(err => {
    //     console.log('createMarketPost - ' + err)
    // })
}

export const updateMarketPost = async (
    data: UpdateMarketPostRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .put(`${MARKET_ENDPOINT_PREFIX}/update`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('updateMarketPost - ' + err)
        })
}

export const saveMarketPostImage = async (postId: number, data: FormData) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`${MARKET_ENDPOINT_PREFIX}/save/image/${postId}`, data)
        .then(res => {
            console.log('saveImage Success', res.data)
            return res.data
        })
        .catch(err => {
            console.log(`saveImage Error - ${err}`)
            throw err
        })
}

export const updateMarketPostImageReset = async (postId: number, data: any) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`${MARKET_ENDPOINT_PREFIX}/update/image/update/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateMarketPostImageReset : update Error - ${err}`)
            throw err
        })
}

export const updateMarketPostImageAdd = async (postId: number, data: any) => {
    const token = await getAccessToken()
    const authAxios = await createAuthAxios({
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    return authAxios
        .post(`${MARKET_ENDPOINT_PREFIX}/update/image/add/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateMarketPostImageAdd : add Error - ${err}`)
            throw err
        })
}

export const updateMarketPostImageDelete = async (
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
        .post(`${MARKET_ENDPOINT_PREFIX}/update/image/delete/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateMarketPostImageDelete : delete Error - ${err}`)
            throw err
        })
}

// ########## DELETE ##########

export const deleteMarketPost = async (postId: number): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`${MARKET_ENDPOINT_PREFIX}/delete/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deleteMarketPost - ' + err)
        })
}
