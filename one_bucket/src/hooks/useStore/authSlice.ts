import { StateCreator } from 'zustand'

export interface AuthSlice {
    loginState: boolean
    setLoginState: (isLoggedIn: boolean) => void
}

export const createAuthSlice: StateCreator<AuthSlice, [], []> = set => ({
    loginState: false,
    setLoginState: (loginState: boolean) => {
        set({ loginState })
    },
})
