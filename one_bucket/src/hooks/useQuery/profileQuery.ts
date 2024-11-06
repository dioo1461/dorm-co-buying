import {
    getMemberInfo,
    getProfile,
    getProfileImage,
} from '@/apis/profileService'
import { GetMemberInfoResponse } from '@/data/response/success/GetMemberInfoResponse'
import { GetProfileResponse } from '@/data/response/success/GetProfileResponse'
import { useQuery } from 'react-query'
import { useBoundStore } from '../useStore/useBoundStore'

export const queryGetMemberInfo = () => {
    const memberInfo = useBoundStore.getState().memberInfo
    // TODO: 캐싱 제대로 작동하는지 확인

    // const checkProfileImageCached = async () => {
    //     const image: ArrayBuffer = await getProfileImage()
    //     return image
    // }

    return useQuery<GetMemberInfoResponse>(
        // TODO: cache 갱신 parameter 수정
        ['memberInfo', memberInfo],
        getMemberInfo,
    )
}

export const queryGetProfile = () => {
    const memberInfo = useBoundStore.getState().memberInfo
    // TODO: 캐싱 제대로 작동하는지 확인

    return useQuery<GetProfileResponse>(['profile', memberInfo], getProfile)
}

export const queryGetProfileImage = () => {
    return useQuery<ArrayBuffer>(
        // TODO: cache 갱신 parameter 수정
        ['profileImage'],
        getProfileImage,
    )
}
