/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

import { getMemberInfo } from '@/apis/profileService'
import strings from '@/constants/strings'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import ProfileModify from '@/screens/PofileModify'
import PostGroupPurchase from '@/screens/PostGroupPurchase'
import ProfileDetails from '@/screens/ProfileDetails'
import Setting from '@/screens/Setting'
import Login from '@/screens/auth/Login'
import SignUp from '@/screens/auth/SignUp'
import SignUp2 from '@/screens/auth/SignUp2'
import SignUp3 from '@/screens/auth/SignUp3'
import SignUp4 from '@/screens/auth/SignUp4'
import SignUp5 from '@/screens/auth/SignUp5'
import SignUp6 from '@/screens/auth/SignUp6'
import SignUp7 from '@/screens/auth/SignUp7'
import BoardCreatePost from '@/screens/home/BoardCreatePost'
import BoardPost from '@/screens/home/BoardPost'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import IcAngleLeft from 'assets/drawable/ic-angle-left.svg'
import { baseColors, darkColors, lightColors } from 'constants/colors'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mainRoutes } from 'screens/navigation/mainRoutes'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
    // key를 통해 테마 변경 시 리렌더링
    const loginState = useBoundStore(state => state.loginState)
    const setLoginState = useBoundStore(state => state.setLoginState)

    const themeColor = useBoundStore(state => state.themeColor)
    const setThemeColor = useBoundStore(state => state.setThemeColor)
    const isDarkMode = useColorScheme() === 'dark'

    useEffect(() => {
        setThemeColor(isDarkMode ? darkColors : lightColors)
    }, [])

    const queryClient = new QueryClient()

    const MainScreen: React.FC = () => {
        return (
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: themeColor.BG,
                    },
                    headerStyle: {
                        backgroundColor: themeColor.HEADER_BG,
                    },
                }}>
                {mainRoutes.map(route => (
                    <Tab.Screen
                        key={`screen-${route.name}`}
                        name={route.name}
                        component={route.component}
                        options={{
                            headerRight: route.headerRight,
                            headerTintColor: themeColor.HEADER_TEXT,
                            tabBarIcon: ({ focused }) => {
                                if (themeColor === lightColors) {
                                    return focused
                                        ? route.activeIconLight
                                        : route.inactiveIconLight
                                } else {
                                    return focused
                                        ? route.activeIconDark
                                        : route.inactiveIconDark
                                }
                            },
                        }}
                    />
                ))}
            </Tab.Navigator>
        )
    }

    useEffect(() => {
        const ac = new AbortController()
        const checkLoginStatus = async () => {
            await getMemberInfo()
                .then(response => {
                    if (response) {
                        // memberInfo를 profileStore에 저장

                        setLoginState(true)
                    }
                })
                .catch(error => {
                    setLoginState(false)
                    if (
                        error.response.status === 401 ||
                        error.response.status === 403
                    ) {
                        console.log(`App - checkLoginStatus error: ${error}`)

                        // TODO: refreshToken으로 accessToken 갱신
                    }
                })
            SplashScreen.hide()
        }

        checkLoginStatus()

        return function cleanup() {
            ac.abort()
        }
    }, [])

    return (
        <>
            <QueryClientProvider client={queryClient}>
                {loginState ? (
                    <NavigationContainer
                        theme={
                            themeColor === lightColors
                                ? lightNavTheme
                                : darkNavTheme
                        }>
                        <Stack.Navigator>
                            <Stack.Screen
                                name='Main'
                                component={MainScreen}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                options={{
                                    headerStyle: {
                                        backgroundColor:
                                            themeColor === lightColors
                                                ? themeColor.HEADER_BG
                                                : themeColor.HEADER_BG,
                                    },
                                    headerTintColor: themeColor.HEADER_TEXT,
                                    headerRight: () => (
                                        <View>
                                            <TouchableOpacity>
                                                <Text
                                                    style={{
                                                        color: themeColor.HEADER_TEXT,
                                                        fontFamily:
                                                            'NanumGothic',
                                                        marginEnd: 16,
                                                    }}>
                                                    임시저장
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ),
                                }}
                                name={strings.postGroupPurchaseScreenName}
                                component={PostGroupPurchase}
                            />
                            <Stack.Screen
                                name={strings.profileDetailsScreenName}
                                component={ProfileDetails}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={strings.profileModifyScreenName}
                                component={ProfileModify}
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name={strings.settingScreenName}
                                component={Setting}
                                options={{
                                    headerLeft: () => {
                                        const navigation = stackNavigation()
                                        return (
                                            <TouchableOpacity
                                                style={{ marginLeft: 16 }}
                                                onPress={() =>
                                                    navigation.goBack()
                                                }>
                                                <IcAngleLeft
                                                    fill={
                                                        themeColor.HEADER_TEXT
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )
                                    },
                                    headerStyle: {
                                        backgroundColor: themeColor.HEADER_BG,
                                    },
                                    headerTitleStyle: {
                                        color: themeColor.HEADER_TEXT,
                                        fontFamily: 'NanumGothic',
                                        fontSize: 18,
                                    },
                                }}
                            />
                            <Stack.Screen
                                name={strings.boardCreatePostScreenName}
                                component={BoardCreatePost}
                                options={{
                                    headerLeft: () => {
                                        const navigation = stackNavigation()
                                        return (
                                            <TouchableOpacity
                                                style={{ marginLeft: 16 }}
                                                onPress={() =>
                                                    navigation.goBack()
                                                }>
                                                <IcAngleLeft
                                                    fill={
                                                        themeColor.HEADER_TEXT
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )
                                    },
                                    headerStyle: {
                                        backgroundColor: themeColor.HEADER_BG,
                                    },
                                    headerTitleStyle: {
                                        color: themeColor.HEADER_TEXT,
                                        fontFamily: 'NanumGothic',
                                        fontSize: 18,
                                    },
                                }}
                            />
                            <Stack.Screen
                                name={strings.boardPostScreenName}
                                component={BoardPost}
                                options={{
                                    headerLeft: () => {
                                        const navigation = stackNavigation()
                                        return (
                                            <TouchableOpacity
                                                style={{ marginLeft: 16 }}
                                                onPress={() =>
                                                    navigation.goBack()
                                                }>
                                                <IcAngleLeft
                                                    fill={
                                                        themeColor.HEADER_TEXT
                                                    }
                                                />
                                            </TouchableOpacity>
                                        )
                                    },
                                    headerStyle: {
                                        backgroundColor: themeColor.HEADER_BG,
                                    },
                                    headerTitleStyle: {
                                        color: themeColor.HEADER_TEXT,
                                        fontFamily: 'NanumGothic',
                                        fontSize: 18,
                                    },
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                ) : (
                    <NavigationContainer
                        theme={
                            themeColor === lightColors
                                ? lightNavTheme
                                : darkNavTheme
                        }>
                        <Stack.Navigator
                            screenOptions={{ headerShown: false }}
                            initialRouteName={strings.loginScreenName}>
                            <Stack.Screen
                                name={strings.loginScreenName}
                                component={Login}
                            />
                            <Stack.Screen
                                name={strings.signUp1ScreenName}
                                component={SignUp}
                            />
                            <Stack.Screen
                                name={strings.signUp2ScreenName}
                                component={SignUp2}
                            />
                            <Stack.Screen
                                name={strings.signUp3ScreenName}
                                component={SignUp3}
                            />
                            <Stack.Screen
                                name={strings.signUp4ScreenName}
                                component={SignUp4}
                            />
                            <Stack.Screen
                                name={strings.signUp5ScreenName}
                                component={SignUp5}
                            />
                            <Stack.Screen
                                name={strings.signUp6ScreenName}
                                component={SignUp6}
                            />
                            <Stack.Screen
                                name={strings.signUp7ScreenName}
                                component={SignUp7}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
                <Toast
                    position='bottom'
                    bottomOffset={40}
                    visibilityTime={1000}
                />
            </QueryClientProvider>
        </>
    )
}

const lightNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: baseColors.WHITE,
    },
}

const darkNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: baseColors.DARK_BG,
    },
}
export default App
