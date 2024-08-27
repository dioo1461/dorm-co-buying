import { darkColors, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import React, { useContext, useEffect } from 'react'
import { Appearance } from 'react-native'
import HomeTab from './HomeTab'

const HomeRoutes: React.FC = (): React.JSX.Element => {
    const { themeColor, setThemeColor } = useContext(AppContext)
    // 다크모드 변경 감지
    useEffect(() => {
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    return <HomeTab />
}

export default HomeRoutes
