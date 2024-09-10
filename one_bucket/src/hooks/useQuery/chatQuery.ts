import { getChatroomsForMember } from '@/apis/chatService'
import { GetRoomsForMemberResponse } from '@/data/response/success/chat/GetRoomsForMemberResponse'
import { useQuery } from 'react-query'

export const queryGetChatroomsForMember = () => {
    return useQuery<GetRoomsForMemberResponse>(
        // TODO: 채팅방 목록 캐싱 구현
        ['chatrooms'],
        getChatroomsForMember,
    )
}
