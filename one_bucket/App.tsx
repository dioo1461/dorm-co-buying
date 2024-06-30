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
import { Image, StyleSheet, useColorScheme } from 'react-native'

import strings from '@/constants/strings'
import { AppContext } from '@/hooks/contexts/AppContext'
import PostGroupPurchase from '@/screens/PostGroupPurchase'
import Login from '@/screens/auth/Login'
import SetProfile from '@/screens/auth/SetProfile'
import SignUp from '@/screens/auth/SignUp'
import {
    checkAccessTokenAvailable,
    removeAccessToken,
} from '@/utils/accessTokenMethods'
import { darkColors, lightColors } from 'constants/colors'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { mainRoutes } from 'screens/navigation/mainRoutes'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const isDarkMode = useColorScheme() === 'dark'
    const themeColor = isDarkMode ? darkColors : lightColors

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
        setIsLoggedIn(await checkAccessTokenAvailable())
        Toast.show({
            type: 'success',
            text1: '성공적으로 로그인하였습니다.',
        })
    }

    const onLoginFailure = async () => {
        Toast.show({
            type: 'error',
            text1: '로그인에 실패하였습니다.',
        })
    }

    useEffect(() => {
        const checkLoginStatus = async () => {
            setIsLoggedIn(await checkAccessTokenAvailable())
        }

        checkLoginStatus()
    }, [isLoggedIn])

    useEffect(() => {
        const ac = new AbortController()

        setTimeout(() => {
            SplashScreen.hide()
        }, 1000)

        return function cleanup() {
            ac.abort()
        }
    }, [])

    return (
        <>
            <AppContext.Provider
                value={{
                    onLogOut,
                    onLogInSuccess,
                    onLoginFailure,
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
                                name={strings.signUpScreenName}
                                component={SignUp}
                            />
                            <Stack.Screen
                                name={strings.setProfileScreenName}
                                component={SetProfile}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                )}
            </AppContext.Provider>
            <Toast position='bottom' bottomOffset={40} visibilityTime={1000} />
        </>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
})

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: 'white',
    },
}

export default App
