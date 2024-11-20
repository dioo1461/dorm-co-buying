import { baseColors, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { homeRoutes } from './HomeRoutes'
import GroupTradeSearch from '../search/GroupTradeSearch'
import { useState } from 'react'
import { View } from 'react-native'
import Loading from '@/components/Loading'

interface Props {
    keyword: string
}

const Tab = createMaterialTopTabNavigator()
const SearchTab: React.FC<Props> = ({ keyword }): JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

    const [isLoading, setIsLoading] = useState(false)

    const onResolve = () => {
        console.log('onResolve')
        setIsLoading(false)
    }

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
            <Tab.Screen
                name='공동구매'
                component={GroupTradeSearch}
                initialParams={{ keyword }}
            />
            <Tab.Screen
                name='중고거래'
                component={View}
                initialParams={{ keyword }}
            />
        </Tab.Navigator>
    )
}

export default SearchTab
