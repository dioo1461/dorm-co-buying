import { getMemberInfo, getProfileImage } from '@/apis/profileService'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { useQuery } from 'react-query'
import { useProfileStore } from '../useStore/useProfileStore'

export const queryGetMemberInfo = () => {
    const data = useProfileStore.getState().memberInfo
    console.log(typeof data)
    return useQuery<GetMemberInfoResponse>(['memberInfo'], getMemberInfo)
}

export const queryGetProfileImage = (token: string) => {
    return useQuery<GetMemberInfoResponse>(
        ['profileImage', token],
        getProfileImage,
    )
}
