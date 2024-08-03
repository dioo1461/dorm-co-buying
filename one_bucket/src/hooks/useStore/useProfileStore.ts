import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { create } from 'zustand'

interface ProfileStore {
    memberInfo: GetMemberInfoResponse | null
    setMemberInfo: (memberInfo: any) => void
}

export const useProfileStore = create<ProfileStore>(set => ({
    memberInfo: null,
    setMemberInfo: (memberInfo: any) => set({ memberInfo }),
}))
