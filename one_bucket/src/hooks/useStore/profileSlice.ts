import { GetMemberInfoResponse } from '@/data/response/GetMemberInfoResponse'
import { StateCreator } from 'zustand'

export interface ProfileSlice {
    memberInfo: GetMemberInfoResponse | null
    setMemberInfo: (memberInfo: GetMemberInfoResponse) => void
}

export const createProfileSlice: StateCreator<ProfileSlice, [], []> = set => ({
    // 기본 초기값으로 빈 객체를 사용, 실제 상황에 맞게 초기화 필요
    memberInfo: null,
    setMemberInfo: (memberInfo: GetMemberInfoResponse) => {
        set({ memberInfo })
    },
})
