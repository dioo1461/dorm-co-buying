import { baseColors, darkColors, lightColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useEffect } from 'react'
import { Appearance } from 'react-native'
import Board from '../home/Board'
import GroupPurchase from '../home/GroupPurchase'
import Home from '../home/Home'
import { homeRoutes } from './HomeRoutes'

const Tab = createMaterialTopTabNavigator()
const HomeTab: React.FC = (): JSX.Element => {
    const { themeColor, setThemeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
        setThemeColor: state.setThemeColor,
    }))

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
                    fontFamily: 'NanumGothic',
                    fontSize: 12,
                },
                swipeEnabled: false,
            }}>
            {homeRoutes.map(route => (
                <Tab.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={{ title: route.title }}
                />
            ))}
        </Tab.Navigator>
    )
}

export default HomeTab
