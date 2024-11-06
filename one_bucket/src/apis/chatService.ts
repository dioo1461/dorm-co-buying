import { GetChatLogAfterTimestampRequestBody } from '@/data/request/chat/GetChatLogAfterTimestampRequestBody'
import { createAuthAxios } from '@/utils/axiosFactory'

const CHAT_BASE_URL = '/chat'

export const getChatLogAfterTimestamp = async (
    data: GetChatLogAfterTimestampRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()

    return authAxios
        .get(CHAT_BASE_URL + `/chat/logs`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}
