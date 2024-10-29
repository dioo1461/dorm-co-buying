import { GetChatLogAfterTimestampRequestBody } from '@/data/request/chat/GetChatLogAfterTimestampRequestBody'
import { GetChatRoomListResponse } from '@/data/response/success/chat/GetChatRoomListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createAuthAxios } from '@/utils/axiosFactory'

const CHAT_BASE_URL = '/chat'

export const getChatRoomList = async (): Promise<GetChatRoomListResponse> => {
    const authAxios = await createAuthAxios()
    const memberInfo = useBoundStore.getState().memberInfo

    return authAxios
        .get(CHAT_BASE_URL + `/chat/sse/chatList`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

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
