import { Icolor, lightColors } from '@/constants/colors'
import { removeAccessToken } from '@/utils/accessTokenUtils'
import { setLoginFlag } from '@/utils/asyncStorageUtils'
import Toast from 'react-native-toast-message'
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

export const createAppSlice: StateCreator<AppSlice, [], []> = (set, get) => ({
    loginState: false,
    setLoginState: (loginState: boolean) => {
        set({ loginState })
    },
    onLogOut: async (showToast: boolean = true) => {
        // await removeAccessToken()
        setLoginFlag(false)
        get().setLoginState(false) // 상태 변경
        if (showToast) {
            Toast.show({
                type: 'success',
                text1: '성공적으로 로그아웃하였습니다.',
            })
        }
    },
    onLogInSuccess: () => {
        setLoginFlag(true)
        get().setLoginState(true) // 상태 변경
        Toast.show({
            type: 'success',
            text1: '성공적으로 로그인하였습니다.',
        })
    },
    onLoginFailure: () => {
        get().setLoginState(false) // 상태 변경
        Toast.show({
            type: 'error',
            text1: '로그인에 실패하였습니다.',
        })
    },
    onPhoneVerificationFailure: () => {
        Toast.show({
            type: 'error',
            text1: '인증번호가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    },
    onSchoolEmailVerificationFailure: () => {
        Toast.show({
            type: 'error',
            text1: '인증 코드가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    },
    onSignUpSuccess: () => {
        Toast.show({
            type: 'success',
            text1: '계정 생성이 완료되었습니다!',
            text2: '이제 세부 프로필 정보 기입을 진행해 주세요.',
            visibilityTime: 2500,
        })
    },
    onSignUpFailure: () => {
        Toast.show({
            type: 'error',
            text1: '서버와의 통신에 오류가 발생했습니다.',
            text2: '잠시 후 다시 시도해 주세요.',
            visibilityTime: 2500,
        })
    },
    themeColor: lightColors,
    setThemeColor: (theme: Icolor) => {
        set({ themeColor: theme })
    },
})
