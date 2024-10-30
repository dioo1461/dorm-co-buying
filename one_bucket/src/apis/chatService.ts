import { GetChatLogAfterTimestampRequestBody } from '@/data/request/chat/GetChatLogAfterTimestampRequestBody'
import { GetChatRoomListResponse } from '@/data/response/success/chat/GetChatRoomListResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createAuthAxios } from '@/utils/axiosFactory'
import EventSource, {
    OpenEvent,
    MessageEvent,
    ErrorEvent,
    CloseEvent,
    TimeoutEvent,
    ExceptionEvent,
} from 'react-native-sse'
import { BASE_URL } from '@env'

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
