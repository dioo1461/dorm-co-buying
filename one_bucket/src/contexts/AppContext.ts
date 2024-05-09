import React, { createContext } from 'react'

interface AppContextInterface {
    onLogOut: () => void
    onLogInSuccess: () => void
    onLoginFailure: () => void
}

export const AppContext = createContext<AppContextInterface>({
    onLogOut: () => {},
    onLogInSuccess: () => {},
    onLoginFailure: () => {},
})
