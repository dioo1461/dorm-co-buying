import { getChatRoomList } from '@/apis/chatService'
import { GetChatRoomListResponse } from '@/data/response/success/chat/GetChatRoomListResponse'
import { useQuery } from 'react-query'

export const queryGetChatroomsForMember = () => {
    return useQuery<GetChatRoomListResponse>(
        // TODO: 채팅방 목록 캐싱 구현
        ['chatrooms'],
        getChatRoomList,
    )
}
