/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { Image, useColorScheme } from 'react-native'

import { getMemberInfo } from '@/apis/profileService'
import strings from '@/constants/strings'
import { AppContext } from '@/hooks/useContext/AppContext'
import { useProfileStore } from '@/hooks/useStore/useProfileStore'
import PostGroupPurchase from '@/screens/PostGroupPurchase'
import ProfileDetails from '@/screens/ProfileDetails'
import Login from '@/screens/auth/Login'
import SignUp from '@/screens/auth/SignUp'
import SignUp2 from '@/screens/auth/SignUp2'
import SignUp3 from '@/screens/auth/SignUp3'
import SignUp4 from '@/screens/auth/SignUp4'
import SignUp5 from '@/screens/auth/SignUp5'
import SignUp6 from '@/screens/auth/SignUp6'
import SignUp7 from '@/screens/auth/SignUp7'
import { removeAccessToken } from '@/utils/accessTokenMethods'
import { darkColors, lightColors } from 'constants/colors'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mainRoutes } from 'screens/navigation/mainRoutes'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const isDarkMode = useColorScheme() === 'dark'
    const themeColor = isDarkMode ? darkColors : lightColors
    const queryClient = new QueryClient()

    const MainScreen: React.FC = () => {
        return (
            <Tab.Navigator initialRouteName='Home'>
                {mainRoutes.map(route => (
                    <Tab.Screen
                        key={`screen-${route.name}`}
                        name={route.name}
                        component={route.component}
                        options={{
                            headerStyle: {
                                backgroundColor: themeColor.ICON_BG,
                            },
                            headerTintColor: themeColor.ICON_TEXT,
                            tabBarIcon: ({ focused }) => {
                                return (
                                    <Image
                                        testID={`tabIcon-${route.name}`}
                                        source={
                                            focused
                                                ? route.activeIcon
                                                : route.inactiveIcon
                                        }
                                        style={{ width: 20, height: 20 }}
                                    />
                                )
                            },
                        }}
                    />
                ))}
            </Tab.Navigator>
        )
    }

    const onLogOut = async () => {
        await removeAccessToken()
        setIsLoggedIn(false)
        Toast.show({
            type: 'success',
            text1: '성공적으로 로그아웃하였습니다.',
        })
    }

    const onLogInSuccess = async () => {
        setIsLoggedIn(true)
        Toast.show({
            type: 'success',
            text1: '성공적으로 로그인하였습니다.',
        })
    }

    const onLoginFailure = async () => {
        setIsLoggedIn(false)
        Toast.show({
            type: 'error',
            text1: '로그인에 실패하였습니다.',
        })
    }

    const onPhoneVerificationFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '인증번호가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    }

    const onSchoolEmailVerificationFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '인증 코드가 일치하지 않습니다. 다시 시도해 주세요.',
        })
    }

    const onSignUpFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '서버와의 통신에 오류가 발생했습니다.',
            text2: '잠시 후 다시 시도해 주세요.',
            visibilityTime: 2500,
        })
    }

    useEffect(() => {
        const ac = new AbortController()

        const checkLoginStatus = async () => {
            getMemberInfo()
                .then(response => {
                    if (response) {
                        setIsLoggedIn(true)
                        // memberInfo를 profileStore에 저장
                        useProfileStore.setState({ memberInfo: response })
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                    }
                })
        }

        checkLoginStatus()
        setTimeout(() => {
            SplashScreen.hide()
        }, 1000)

        return function cleanup() {
            ac.abort()
        }
    }, [])

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider
                    value={{
                        onLogOut,
                        onLogInSuccess,
                        onLoginFailure,
                        onPhoneVerificationFailure,
                        onSchoolEmailVerificationFailure,
                        onSignUpFailure,
                        themeColor,
                    }}>
                    {isLoggedIn ? (
                        <NavigationContainer theme={navTheme}>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name='Main'
                                    component={MainScreen}
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name={strings.postGroupPurchaseScreenName}
                                    component={PostGroupPurchase}
                                />
                                <Stack.Screen
                                    name={strings.profileDetailsScreenName}
                                    component={ProfileDetails}
                                    options={{ headerShown: false }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    ) : (
                        <NavigationContainer theme={navTheme}>
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
                </AppContext.Provider>
                <Toast
                    position='bottom'
                    bottomOffset={40}
                    visibilityTime={1000}
                />
            </QueryClientProvider>
        </>
    )
}

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white',
    },
}

export default App
