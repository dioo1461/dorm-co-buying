import { create } from 'zustand'

interface AuthStore {
    accessToken: string
    setAccessToken: (accessToken: string) => void
    refreshToken: string
    setRefreshToken: (refreshToken: string) => void
    memberInfo: any
    setMemberInfo: (memberInfo: any) => void
}

export const useAuthStore = create<AuthStore>(set => ({
    accessToken: '',
    setAccessToken: (accessToken: string) => set({ accessToken }),
    refreshToken: '',
    setRefreshToken: (refreshToken: string) => set({ refreshToken }),
    memberInfo: null,
    setMemberInfo: (memberInfo: any) => set({ memberInfo }),
}))
