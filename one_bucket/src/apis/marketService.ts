import { CreateMarketPostRequestBody } from '@/data/request/market/CreateMarketPostBody'
import { GetMarketPostListResponse } from '@/data/response/success/market/GetMarketPostListResponse'
import { GetMarketPostResponse } from '@/data/response/success/market/GetMarketPostResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const MARKET_ENDPOINT_PREFIX = 'market-post'

export const createMarketPost = async (data: CreateMarketPostRequestBody) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`/${MARKET_ENDPOINT_PREFIX}/create`, data)
        .then(res => {
            return res.data
        })
    // .catch(err => {
    //     console.log('createMarketPost - ' + err)
    // })
}

export const getMarketPostList = async (
    boardId: number,
    page = 0,
    size = 10,
    sortParams: string[],
): Promise<GetMarketPostListResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(`/${MARKET_ENDPOINT_PREFIX}/list/${boardId}`, {
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
        .get(`/${MARKET_ENDPOINT_PREFIX}/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('getMarketPost - ' + err)
        })
}
