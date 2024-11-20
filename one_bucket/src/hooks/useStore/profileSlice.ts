import { GetMemberInfoResponse } from '@/data/response/success/auth/GetMemberInfoResponse'
import { GetProfileResponse } from '@/data/response/success/auth/GetProfileResponse'
import { StateCreator } from 'zustand'

export interface ProfileSlice {
    memberInfo: GetMemberInfoResponse | null
    setMemberInfo: (memberInfo: GetMemberInfoResponse) => void
    profile: GetProfileResponse | null
    setProfile: (profile: GetProfileResponse) => void
}

export const createProfileSlice: StateCreator<ProfileSlice, [], []> = set => ({
    // 기본 초기값으로 빈 객체를 사용, 실제 상황에 맞게 초기화 필요
    memberInfo: null,
    setMemberInfo: (memberInfo: GetMemberInfoResponse) => {
        set({ memberInfo })
    },
    profile: null,
    setProfile: (profile: GetProfileResponse) => {
        set({ profile })
    },
})
