import { CreateGroupTradePostRequestBody } from '@/data/request/groupTrade/CreateGroupTradePostRequestBody'
import { UpdateGroupTradePostRequestBody } from '@/data/request/groupTrade/UpdateGroupTradePostRequestBody'
import { CreateGroupTradePostResponse } from '@/data/response/success/groupTrade/CreateGroupTradePostResponse'
import { GetGroupTradePostListResponse } from '@/data/response/success/groupTrade/GetGroupTradePostListResponse'
import { getAccessToken } from '@/utils/accessTokenUtils'
import { GetGroupTradePostResponse } from '@/data/response/success/groupTrade/GetGroupTradePostResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const MARKET_ENDPOINT_PREFIX = '/group-post'

// ########## GET ##########

export const getGroupTradePostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetGroupTradePostListResponse> => {
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
            console.log('getGroupTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getGroupTradePost = async (
    postId: number,
): Promise<GetGroupTradePostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('getGroupTradePost - ' + err)
        })
}

export const getMyGroupTradePostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetGroupTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/list/my/${boardId}`, {
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
            console.log('getMyGroupTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const getJoinedGroupTradePostList = async (
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetGroupTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/list/joins`, {
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
            console.log('getJoinedGroupTradePostList - ' + error)
            // console.log(error.response)

            throw error
        })
}

export const searchGroupTradePosts = async (
    boardId: number,
    keyword: string,
    option: 'title' | 'content' | 'titleAndContent',
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetGroupTradePostListResponse> => {
    const authAxios = await createAuthAxios()
    const optionNumber = option === 'title' ? 1 : option === 'content' ? 2 : 3
    return authAxios
        .get(`${MARKET_ENDPOINT_PREFIX}/search`, {
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
            console.log('searchGroupTradePosts - ' + error)
            throw error
        })
}

// ########## POST ##########

export const createGroupTradePost = async (
    data: CreateGroupTradePostRequestBody,
): Promise<CreateGroupTradePostResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`${MARKET_ENDPOINT_PREFIX}/create`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('createGroupTradePost - ' + err)
        })
}

export const updateGroupTradePost = async (
    data: UpdateGroupTradePostRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .put(`${MARKET_ENDPOINT_PREFIX}/update`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('updateGroupTradePost - ' + err)
        })
}

export const saveGroupTradePostImage = async (
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

export const updateGroupTradePostImageReset = async (
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
        .post(`${MARKET_ENDPOINT_PREFIX}/update/image/update/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(
                `updateGroupTradePostImageReset : update Error - ${err}`,
            )
            throw err
        })
}

export const updateGroupTradePostImageAdd = async (
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
        .post(`${MARKET_ENDPOINT_PREFIX}/update/image/add/${postId}`, data)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log(`updateGroupTradePostImageAdd : add Error - ${err}`)
            throw err
        })
}

export const updateGroupTradePostImageDelete = async (
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
            console.log(
                `updateGroupTradePostImageDelete : delete Error - ${err}`,
            )
            throw err
        })
}

// ########## DELETE ##########

export const deleteGroupTradePost = async (postId: number): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(`${MARKET_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('deleteGroupTradePost - ' + err)
        })
}
