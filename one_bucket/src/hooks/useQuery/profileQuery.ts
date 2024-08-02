import { getMemberInfo, getProfileImage } from '@/apis/profileService'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { useQuery } from 'react-query'
import { useProfileStore } from '../useStore/useProfileStore'

export const queryGetMemberInfo = () => {
    const memberInfoData = useProfileStore.getState().memberInfo
    // TODO: 캐싱 제대로 작동하는지 확인

    const checkProfileImageCached = async () => {
        const image: ArrayBuffer = await getProfileImage()
        return image
    }

    return useQuery<[GetMemberInfoResponse, ArrayBuffer]>(
        ['memberInfo', memberInfoData],
        async () => {
            const promise = await Promise.all([
                getMemberInfo(),
                checkProfileImageCached(),
            ])
            return promise
        },
    )
}

export const queryGetProfileImage = (token: string) => {
    return useQuery<GetMemberInfoResponse>(
        ['profileImage', token],
        getProfileImage,
    )
}
