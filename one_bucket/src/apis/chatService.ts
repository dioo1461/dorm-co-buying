import { GetRoomsForMemberResponse } from '@/data/response/success/chat/GetRoomsForMemberResponse'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createAuthAxios } from '@/utils/axiosFactory'

const CHAT_BASE_URL = '/chat'

export const getChatroomsForMember =
    async (): Promise<GetRoomsForMemberResponse> => {
        const authAxios = await createAuthAxios()
        const memberInfo = useBoundStore.getState().memberInfo

        return authAxios
            .get(CHAT_BASE_URL + `/room/user/${memberInfo?.nickname}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
    }
