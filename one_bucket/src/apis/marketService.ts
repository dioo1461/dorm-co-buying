import { CreateMarketPostRequestBody } from '@/data/request/market/CreateMarketPostBody'
import { createAuthAxios } from '@/utils/axiosFactory'

const MARKET_PREFIX = 'market-post'

export const createMarketPost = async (data: CreateMarketPostRequestBody) => {
    const authAxios = await createAuthAxios()
    return authAxios.post(`/${MARKET_PREFIX}/create`, data).then(res => {
        return res.data
    })
}
