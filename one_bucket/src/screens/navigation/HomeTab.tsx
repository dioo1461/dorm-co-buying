import { baseColors, lightColors } from '@/constants/colors'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { homeRoutes } from './HomeRoutes'

const Tab = createMaterialTopTabNavigator()
const HomeTab: React.FC = (): JSX.Element => {
    const { themeColor } = useBoundStore(state => ({
        themeColor: state.themeColor,
    }))

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
