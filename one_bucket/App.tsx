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
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'

import { getBoardList } from '@/apis/boardService'
import { getMemberInfo, getProfile } from '@/apis/profileService'
import strings from '@/constants/strings'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import Login from '@/screens/auth/Login'
import NewPw from '@/screens/auth/NewPw'
import NewPw2 from '@/screens/auth/NewPw2'
import SignUp5 from '@/screens/auth/SignUp5'
import SignUp6 from '@/screens/auth/SignUp6'
import SignUp7 from '@/screens/auth/SignUp7'
import UnauthHome from '@/screens/UnauthHome'
import Chat from '@/screens/chat/Chat'
import BoardCreatePost from '@/screens/home/BoardCreatePost'
import BoardPost from '@/screens/home/BoardPost'
import CreateMarketPost from '@/screens/home/CreateMarketPost'
import MarketPost from '@/screens/home/MarketPost'
import ImageEnlargement from '@/screens/ImageEnlargement'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import Notification from '@/screens/Notification'
import ProfileModify from '@/screens/PofileModify'
import ProfileDetails from '@/screens/ProfileDetails'
import Search from '@/screens/Search'
import AlertSetting from '@/screens/setting/AlertSetting'
import Announcement from '@/screens/setting/Announcement'
import ChangePw from '@/screens/setting/ChangePw'
import ChangePw2 from '@/screens/setting/ChangePw2'
import PhoneAuth1 from '@/screens/setting/PhoneAuth1'
import PhoneAuth2 from '@/screens/setting/PhoneAuth2'
import PhoneAuth3 from '@/screens/setting/PhoneAuth3'
import SchoolAuth1 from '@/screens/setting/SchoolAuth1'
import SchoolAuth2 from '@/screens/setting/SchoolAuth2'
import SchoolAuth3 from '@/screens/setting/SchoolAuth3'
import Setting from '@/screens/setting/Setting'
import Support from '@/screens/setting/Support'
import VersionCheck from '@/screens/setting/VersionCheck'
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
    const {
        loginState,
        setLoginState,
        setMemberInfo,
        setProfile,
        setBoardList,
    } = useBoundStore(state => ({
        loginState: state.loginState,
        setLoginState: state.setLoginState,
        setMemberInfo: state.setMemberInfo,
        setProfile: state.setProfile,
        setBoardList: state.setBoardList,
    }))

    const themeColor = useBoundStore(state => state.themeColor)
    const setThemeColor = useBoundStore(state => state.setThemeColor)
    const isDarkMode = useColorScheme() === 'dark'

    useEffect(() => {
        setThemeColor(isDarkMode ? darkColors : lightColors)
    }, [])

    const queryClient = new QueryClient()

    const [authed, setAuthed] = useState(0)

    useEffect(() => {
        const ac = new AbortController()
        const checkLoginStatus = async () => {
            console.log('app - checkLoginStatus')
            await getMemberInfo()
                .then(response => {
                    if (response) {
                        // memberInfo를 profileStore에 저장
                        setMemberInfo(response)
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
            await getBoardList()
                .then(res => {
                    setBoardList(res)
                    setAuthed(0)
                })
                .catch(err => {
                    console.log(`getBoardList - ${err}`)
                    setAuthed(1)
                })
            await getProfile()
                .then(res => {
                    setProfile(res)
                })
                .catch(err => {
                    console.log(`getProfile - ${err}`)
                })
            SplashScreen.hide()
        }

        checkLoginStatus()

        return function cleanup() {
            ac.abort()
        }
    }, [loginState])

    const home = (authed: number) => {
        if (authed == 0) return strings.homeScreenName
        else return strings.unauthHomeScreenName
    }

    const MainScreen: React.FC = () => {
        return (
            <Tab.Navigator
                initialRouteName={home(authed)}
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: themeColor.BG,
                    },
                    headerStyle: {
                        backgroundColor: themeColor.HEADER_BG,
                    },
                }}>
                {mainRoutes[authed].map(route => (
                    <Tab.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={{
                            title: route.title,
                            tabBarLabel: route.tabBarLabel,
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

    return (
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
                            name={strings.unauthHomeScreenName}
                            component={UnauthHome}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.createMarketPostScreenName}
                            component={CreateMarketPost}
                            options={{
                                title: strings.createMarketPostScreenTitle,
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
                                                    fontFamily: 'NanumGothic',
                                                    marginEnd: 16,
                                                }}>
                                                임시저장
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ),
                            }}
                        />
                        <Stack.Screen
                            name={strings.marketPostScreenName}
                            component={MarketPost}
                            options={{ headerShown: false }}
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
                                title: strings.settingScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                            name={strings.schoolAuth1ScreenName}
                            component={SchoolAuth1}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.schoolAuth2ScreenName}
                            component={SchoolAuth2}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.schoolAuth3ScreenName}
                            component={SchoolAuth3}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.phoneAuth1ScreenName}
                            component={PhoneAuth1}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.phoneAuth2ScreenName}
                            component={PhoneAuth2}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.phoneAuth3ScreenName}
                            component={PhoneAuth3}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.changePwScreenName}
                            component={ChangePw}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.changePw2ScreenName}
                            component={ChangePw2}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.alertSettingScreenName}
                            component={AlertSetting}
                            options={{
                                title: strings.alertSettingScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                            name={strings.announcementScreenName}
                            component={Announcement}
                            options={{
                                title: strings.announcementScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                            name={strings.supportScreenName}
                            component={Support}
                            options={{
                                title: strings.supportScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                            name={strings.versionCheckScreenName}
                            component={VersionCheck}
                            options={{
                                title: strings.versionCheckScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                                title: strings.boardCreatePostScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                        />
                        <Stack.Screen
                            name={strings.imageEnlargementScreenName}
                            component={ImageEnlargement}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={strings.chatScreenName}
                            component={Chat}
                        />
                        <Stack.Screen
                            name={strings.searchScreenName}
                            component={Search}
                            options={{
                                headerShown: false,
                            }}
                        />
                        <Stack.Screen
                            name={strings.notificationScreenName}
                            component={Notification}
                            options={{
                                title: strings.notificationScreenTitle,
                                headerLeft: () => {
                                    const navigation = stackNavigation()
                                    return (
                                        <TouchableOpacity
                                            style={{ marginLeft: 16 }}
                                            onPress={() => navigation.goBack()}>
                                            <IcAngleLeft
                                                fill={themeColor.HEADER_TEXT}
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
                        <Stack.Screen
                            name={strings.newPwScreenName}
                            component={NewPw}
                        />
                        <Stack.Screen
                            name={strings.newPw2ScreenName}
                            component={NewPw2}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            )}
            <Toast position='bottom' bottomOffset={40} visibilityTime={1000} />
        </QueryClientProvider>
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
