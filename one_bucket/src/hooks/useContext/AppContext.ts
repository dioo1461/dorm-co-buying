import { Icolor, lightColors } from '@/constants/colors'
import { createContext } from 'react'

interface AppContextInterface {
    onLogOut: () => void
    onLogInSuccess: () => void
    onLoginFailure: () => void
    onPhoneVerificationFailure: () => void
    onSchoolEmailVerificationFailure: () => void
    onSignUpSuccess: () => void
    onSignUpFailure: () => void
    themeColor: Icolor
    setThemeColor: (color: Icolor) => void
}

export const AppContext = createContext<AppContextInterface>({
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
