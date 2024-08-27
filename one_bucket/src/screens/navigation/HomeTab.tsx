import { baseColors, darkColors, lightColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { AppContext } from '@/hooks/useContext/AppContext'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useContext, useEffect } from 'react'
import { Appearance } from 'react-native'
import GroupPurchase from '../home/GroupPurchase'
import Home from '../home/Home'

const Tab = createMaterialTopTabNavigator()
const HomeTab = () => {
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

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarIndicatorStyle: {
                    backgroundColor: baseColors.GRAY_2,
                },
                tabBarStyle: {
                    backgroundColor:
                        themeColor === lightColors
                            ? baseColors.WHITE
                            : baseColors.DARK_BG,
                },
                tabBarLabelStyle: {
                    color: themeColor.TEXT,
                },
            }}>
            <Tab.Screen name={strings.homeScreenName} component={Home} />
            <Tab.Screen
                name={strings.groupPurchaseScreenName}
                component={GroupPurchase}
            />
            <Tab.Screen
                name={strings.tradingScreenName}
                component={GroupPurchase}
            />
            <Tab.Screen
                name={strings.freeboardScreenName}
                component={GroupPurchase}
            />
        </Tab.Navigator>
    )
}

export default HomeTab
