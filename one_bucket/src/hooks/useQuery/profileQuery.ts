import {
    getMemberInfo,
    getProfile,
    getProfileImage,
} from '@/apis/profileService'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { GetProfileResponse } from '@/data/response/GetProfileResponse'
import { useQuery } from 'react-query'
import { useBoundStore } from '../useStore/useBoundStore'

export const queryGetMemberInfo = () => {
    const memberInfo = useBoundStore(state => state.memberInfo)
    // TODO: 캐싱 제대로 작동하는지 확인

    const checkProfileImageCached = async () => {
        const image: ArrayBuffer = await getProfileImage()
        return image
    }

    return useQuery<[GetMemberInfoResponse, ArrayBuffer]>(
        ['memberInfo', memberInfo],
        async () => {
            const promise = await Promise.all([
                getMemberInfo(),
                checkProfileImageCached(),
            ])
            return promise
        },
    )
}

export const queryGetProfile = () => {
    return useQuery<GetProfileResponse>(['profile'], getProfile)
}

export const queryGetProfileImage = (token: string) => {
    return useQuery<GetMemberInfoResponse>(
        ['profileImage', token],
        getProfileImage,
    )
}
