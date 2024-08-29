import { Icolor, lightColors } from '@/constants/colors'
import { StateCreator } from 'zustand'

export interface AppSlice {
    loginState: boolean
    setLoginState: (isLoggedIn: boolean) => void
    onLogOut: {
        (showToast: boolean): void
        (): void
    }
    onLogInSuccess: () => void
    onLoginFailure: () => void
    onPhoneVerificationFailure: () => void
    onSchoolEmailVerificationFailure: () => void
    onSignUpSuccess: () => void
    onSignUpFailure: () => void
    themeColor: Icolor
    setThemeColor: (color: Icolor) => void
}

export const createAppSlice: StateCreator<AppSlice, [], []> = set => ({
    loginState: false,
    setLoginState: (loginState: boolean) => {
        set({ loginState })
    },
    onLogOut: () => {},
    onLogInSuccess: () => {},
    onLoginFailure: () => {},
    onPhoneVerificationFailure: () => {},
    onSchoolEmailVerificationFailure: () => {},
    onSignUpSuccess: () => {},
    onSignUpFailure: () => {},
    themeColor: lightColors,
    setThemeColor: () => {},
})
