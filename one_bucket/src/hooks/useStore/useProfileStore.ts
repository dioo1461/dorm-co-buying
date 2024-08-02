import { create } from 'zustand'

interface ProfileStore {
    memberInfo: any
    setMemberInfo: (memberInfo: any) => void
}

export const useProfileStore = create<ProfileStore>(set => ({
    memberInfo: null,
    setMemberInfo: (memberInfo: any) => set({ memberInfo }),
}))
