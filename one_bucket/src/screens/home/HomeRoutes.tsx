import { darkColors, lightColors } from '@/constants/colors'
import { AppContext } from '@/hooks/useContext/AppContext'
import React, { useContext, useEffect } from 'react'
import { Appearance, Dimensions } from 'react-native'
import HomeTab from '../navigation/HomeTab'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

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
