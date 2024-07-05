import { Icolor, lightColors } from '@/constants/colors'
import { createContext } from 'react'

interface AppContextInterface {
    onLogOut: () => void
    onLogInSuccess: () => void
    onLoginFailure: () => void
    onPhoneVerificationFailure: () => void
    onSchoolEmailVerificationFailure: () => void
    themeColor: Icolor
}

export const AppContext = createContext<AppContextInterface>({
    onLogOut: () => {},
    onLogInSuccess: () => {},
    onLoginFailure: () => {},
    onPhoneVerificationFailure: () => {},
    onSchoolEmailVerificationFailure: () => {},
    themeColor: lightColors,
})
