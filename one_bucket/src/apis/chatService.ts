import { GetChatLogAfterTimestampResponse } from '@/data/response/success/chat/GetChatLogAfterTimestampResponse'
import { GetChatRoomTradeInfoResponse } from '@/data/response/success/chat/GetChatRoomTradeInfoResponse'
import { createAuthAxios } from '@/utils/axiosFactory'

const CHAT_ENDPOINT_PREFIX = '/chat'

export const getChatLogAfterTimestamp = async (
    roomId: string,
    timestamp: string,
): Promise<GetChatLogAfterTimestampResponse> => {
    const authAxios = await createAuthAxios()

    return authAxios
        .get(CHAT_ENDPOINT_PREFIX + `/logs`, {
            params: {
                roomId: roomId,
                timestamp: timestamp,
            },
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
        .post(CHAT_ENDPOINT_PREFIX + '/join', {
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
        .delete(CHAT_ENDPOINT_PREFIX + '/quit', {
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

export const destroyChatRoom = async (chatRoomId: string): Promise<any> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(CHAT_ENDPOINT_PREFIX + `/bomb/${chatRoomId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

export const getTradeInfoOfChatRoom = async (
    chatRoomId: string,
): Promise<GetChatRoomTradeInfoResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(CHAT_ENDPOINT_PREFIX + `/trade/${chatRoomId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}
