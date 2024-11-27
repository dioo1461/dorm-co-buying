import { GetChatLogAfterTimestampResponse } from '@/data/response/success/chat/GetChatLogAfterTimestampResponse'
import { GetChatRoomInfoResponse } from '@/data/response/success/chat/GetChatRoomInfoResponse'
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
            console.log('getChatLogAfterTimestamp', roomId, timestamp)
            return res.data
        })
        .catch(err => {
            console.log('getChatLogAfterTimestamp error', err)
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

export const getChatroomInfo = async (
    chatRoomId: string,
): Promise<GetChatRoomInfoResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get(CHAT_ENDPOINT_PREFIX + `/info/${chatRoomId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

export const registerChatNotification = async (chatRoomId: string) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post(CHAT_ENDPOINT_PREFIX + `/push/re-register/${chatRoomId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}

export const unRegisterChatNotification = async (chatRoomId: string) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete(CHAT_ENDPOINT_PREFIX + `/push/un-register/${chatRoomId}`)
        .then(res => {
            return res.data
        })
        .catch(err => {
            throw err
        })
}
