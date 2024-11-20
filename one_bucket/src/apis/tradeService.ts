import { JoinGroupTradeResponse } from '@/data/response/success/groupTrade/JoinGroupTradeResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const TRADE_ENDPOINT_PREFIX = 'group-trade'

export const joinTrade = async (
    tradeId: number,
): Promise<JoinGroupTradeResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(`/${TRADE_ENDPOINT_PREFIX}/join/${tradeId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            console.log('joinGroupTrade - ' + err)
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
            console.log('quitGroupTrade - ' + err)
        })
}
