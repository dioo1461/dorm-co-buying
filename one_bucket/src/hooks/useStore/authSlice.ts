import { StateCreator } from 'zustand'

export interface AuthSlice {
    loginState: boolean
    setLoginState: (isLoggedIn: boolean) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
}

export const createAuthSlice: StateCreator<AuthSlice, [], []> = set => ({
    loginState: false,
    setLoginState: (loginState: boolean) => {
        set({ loginState })
    },
    accessToken: '',
    setAccessToken: (accessToken: string) => {
        set({ accessToken })
    },
})
