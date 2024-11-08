import { GetChatLogAfterTimestampResponse } from '@/data/response/success/chat/GetChatLogAfterTimestampResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const CHAT_BASE_URL = '/chat'

export const getChatLogAfterTimestamp = async (
    roomId: string,
    timestamp: string
): Promise<GetChatLogAfterTimestampResponse> => {
    const authAxios = await createAuthAxios()

    return authAxios
        .get(CHAT_BASE_URL + `/chat/logs`, {
            params: {
                roomId: roomId,
                timestamp: timestamp
            }
        })
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
