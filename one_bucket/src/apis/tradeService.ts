import { JoinTradeResponse } from "@/data/response/success/market/JoinTradeResponse"
import { createAuthAxios } from "@/utils/axiosFactory"

const TRADE_ENDPOINT_PREFIX = 'trade'

export const joinTrade = async (postId: number): Promise<JoinTradeResponse> => {
    const  authAxios = await createAuthAxios()
    return authAxios
        .post(`/${TRADE_ENDPOINT_PREFIX}/join/${postId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('joinGroupPurchase - ' + err)
        })
}

export const quitTrade = async (tradeId: number): Promise<void> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`/${TRADE_ENDPOINT_PREFIX}/quit/${tradeId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('quitGroupPurchase - ' + err)
        })
}