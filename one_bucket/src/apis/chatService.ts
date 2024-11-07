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

export const joinChatRoom = async (chatRoomId: string): Promise<any> => {
    const authAxios = await createAuthAxios()

    return authAxios
        .post(CHAT_BASE_URL + '/chat/join', {
            roomId: chatRoomId,
        })
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

export const quitChatRoom = async (chatRoomId: string): Promise<any> => {
    const authAxios = await createAuthAxios()

    return authAxios
        .delete(CHAT_BASE_URL + '/chat/quit', {
            params: {
                roomId: chatRoomId,
            },
        })
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}
