import {
    requestAccessTokenRenew,
    submitFCMDeviceToken,
} from '@/apis/authService'
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
import Chat from '@/screens/chat/Chat'
import BoardPost from '@/screens/home/board/BoardPost'
import CreateBoardPost from '@/screens/home/board/CreateBoardPost'
import UpdateBoardPost from '@/screens/home/board/UpdateBoardPost'
import ImageEnlargement from '@/screens/ImageEnlargement'
import MyLikedPosts from '@/screens/myPage/MyLikedPosts'
import MyBoardPosts from '@/screens/myPage/MyBoardPosts'
import MyGroupTradePosts from '@/screens/myPage/MyGroupTradePosts'
import ProfileModify from '@/screens/myPage/PofileModify'
import ProfileDetails from '@/screens/myPage/ProfileDetails'
import { stackNavigation } from '@/screens/navigation/NativeStackNavigation'
import Notification from '@/screens/Notification'
import Search from '@/screens/search/Search'
import AlertSetting from '@/screens/setting/AlertSetting'
import AnnouncementList from '@/screens/setting/AnnouncementList'
import AnnouncementPost from '@/screens/setting/AnnouncementPost'
import ChangePw from '@/screens/setting/ChangePw'
import ChangePw2 from '@/screens/setting/ChangePw2'
import SchoolAuth1 from '@/screens/setting/SchoolAuth1'
import SchoolAuth2 from '@/screens/setting/SchoolAuth2'
import SchoolAuth3 from '@/screens/setting/SchoolAuth3'
import Setting from '@/screens/setting/Setting'
import Support from '@/screens/setting/Support'
import VersionCheck from '@/screens/setting/VersionCheck'
import UnauthHome from '@/screens/UnauthHome'
import {
    decodeAccessToken,
    decodeRefreshToken,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    validateAccessToken,
    validateRefreshToken,
} from '@/utils/accessTokenUtils'
import {
    getAutoLoginEnabled,
    getLoginInitFlag,
} from '@/utils/asyncStorageUtils'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import IcAngleLeft from 'assets/drawable/ic-angle-left.svg'
import axios from 'axios'
import { baseColors, darkColors, lightColors } from 'constants/colors'
import React, { useEffect, useState } from 'react'
import {
    Appearance,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from 'react-query'
import { mainRoutes } from 'screens/navigation/mainRoutes'
import messaging from '@react-native-firebase/messaging'
import linking from '@/screens/navigation/linking'
import UsedTradePost from '@/screens/home/usedTrade/UsedTradePost'
import CreateGroupTradePost from '@/screens/home/groupTrade/CreateGroupTradePost'
import UpdateGroupTradePost from '@/screens/home/groupTrade/UpdateGroupTradePost'
import CreateUsedTradePost from '@/screens/home/usedTrade/CreateUsedTradePost'
import UpdateUsedTradePost from '@/screens/home/usedTrade/UpdateUsedTradePost'
import GroupTradePost from '@/screens/home/groupTrade/GroupTradePost'
import MyUsedTradePosts from '@/screens/myPage/MyUsedTradePosts'

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

    // 다크모드 변경 감지
    useEffect(() => {
        setThemeColor(isDarkMode ? darkColors : lightColors)
        const themeSubscription = Appearance.addChangeListener(
            ({ colorScheme }) => {
                setThemeColor(colorScheme === 'dark' ? darkColors : lightColors)
            },
        )
        return () => themeSubscription.remove()
    }, [])

    const queryClient = new QueryClient()

    const [authed, setAuthed] = useState(0)

    // ###### check login status ######
    useEffect(() => {
        const ac = new AbortController()

        const renewAccessToken = async () => {
            const autoLoginEnabled = await getAutoLoginEnabled()
            if (autoLoginEnabled === null || autoLoginEnabled === 'false')
                return

            console.log('app - renewAccessToken: autoLoginEnabled is true')
            const [accessTokenAvailable, refreshTokenAvailable] =
                await Promise.all([
                    validateAccessToken(),
                    validateRefreshToken(),
                ])

            console.log('accessTokenAvailable:', accessTokenAvailable)
            console.log('refreshTokenAvailable:', refreshTokenAvailable)
            console.log('$$$$$$ accessToken', await getAccessToken())
            console.log('refreshToken', await getRefreshToken())
            console.log(
                '$$$$$$ current time:',
                Math.floor(new Date().getTime() / 1000),
            )
            console.log('accessTokenDecoded', await decodeAccessToken())
            console.log('refreshTokenDecoded', await decodeRefreshToken())
            if (accessTokenAvailable) return
            console.log('$$$$$$ accessToken is expired or invalid')
            if (!refreshTokenAvailable) return
            console.log('$$$$$$ refreshToken is valid')
            // refresh token으로 access token 갱신
            const response = await requestAccessTokenRenew()

            return Promise.all([
                setAccessToken(response.accessToken),
                setRefreshToken(response.refreshToken),
            ])
        }

        const checkLoginStatus = async () => {
            const loginInitFlag = await getLoginInitFlag()
            if (loginInitFlag === null || loginInitFlag === 'false') {
                SplashScreen.hide()
                return
            }
            console.log('app - checkLoginStatus')
            const [memberInfo, boardList, profile] = await Promise.all([
                getMemberInfo(),
                getBoardList(),
                getProfile(),
            ])

            if (memberInfo) {
                setMemberInfo(memberInfo) // memberInfo 저장
                setAuthed(0)
            }
            if (memberInfo.university == 'null') {
                setAuthed(1)
            }
            setBoardList(boardList)
            setProfile(profile)
            setLoginState(true)
        }

        const submitFCMToken = async () => {
            const token = await messaging().getToken()
            console.log('device token:', token)
            submitFCMDeviceToken(token)
        }

        const executeSynchronously = async () => {
            try {
                await renewAccessToken()
                await checkLoginStatus()
                if (loginState) submitFCMToken()
            } catch (error) {
                // 요청 실패 시 처리
                setAuthed(1)
                if (!axios.isAxiosError(error)) return

                if (
                    error.response &&
                    (error.response.status === 401 ||
                        error.response.status === 403)
                ) {
                    console.log(`App - checkLoginStatus error: ${error}`)
                }
                if (error.message) {
                    console.log(`Error: ${error.message}`)
                }
            } finally {
                SplashScreen.hide() // 모든 요청이 끝난 후 SplashScreen 숨기기
            }
        }

        executeSynchronously()

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
            <NavigationContainer
                linking={linking}
                theme={
                    themeColor === lightColors ? lightNavTheme : darkNavTheme
                }>
                {loginState ? (
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
                            name={strings.groupTradePostScreenName}
                            component={GroupTradePost}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.createGroupTradePostScreenName}
                            component={CreateGroupTradePost}
                            options={{
                                title: strings.createGroupTradePostScreenTitle,
                                headerStyle: {
                                    backgroundColor: themeColor.HEADER_BG,
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
                            name={strings.updateGroupTradePostScreenName}
                            component={UpdateGroupTradePost}
                            options={{
                                title: strings.updateGroupTradePostScreenTitle,
                                headerStyle: {
                                    backgroundColor: themeColor.HEADER_BG,
                                },
                                headerTintColor: themeColor.HEADER_TEXT,
                            }}
                        />
                        <Stack.Screen
                            name={strings.usedTradePostScreenName}
                            component={UsedTradePost}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name={strings.createUsedTradePostScreenName}
                            component={CreateUsedTradePost}
                            options={{
                                title: strings.createUsedTradePostScreenTitle,
                                headerStyle: {
                                    backgroundColor: themeColor.HEADER_BG,
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
                            name={strings.updateUsedTradePostScreenName}
                            component={UpdateUsedTradePost}
                            options={{
                                title: strings.updateUsedTradePostScreenTitle,
                                headerStyle: {
                                    backgroundColor: themeColor.HEADER_BG,
                                },
                                headerTintColor: themeColor.HEADER_TEXT,
                            }}
                        />
                        <Stack.Screen
                            name={strings.profileDetailsScreenName}
                            component={ProfileDetails}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name={strings.profileModifyScreenName}
                            component={ProfileModify}
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
                            name={strings.announcementListScreenName}
                            component={AnnouncementList}
                            options={{
                                title: strings.announcementListScreenTitle,
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
                            name={strings.announcementPostScreenName}
                            component={AnnouncementPost}
                            options={{
                                title: strings.announcementPostScreenTitle,
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
                            component={CreateBoardPost}
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
                            name={strings.updateBoardPostScreenName}
                            component={UpdateBoardPost}
                        />
                        <Stack.Screen
                            name={strings.boardPostScreenName}
                            component={BoardPost}
                            options={{ title: strings.boardPostScreenTitle }}
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
                        <Stack.Screen
                            name={strings.myLikedPostsScreenName}
                            component={MyLikedPosts}
                        />
                        <Stack.Screen
                            name={strings.myBoardPostsScreenName}
                            component={MyBoardPosts}
                        />
                        <Stack.Screen
                            name={strings.myGroupTradePostsScreenName}
                            component={MyGroupTradePosts}
                        />
                        <Stack.Screen
                            name={strings.myUsedTradePostsScreenName}
                            component={MyUsedTradePosts}
                        />
                    </Stack.Navigator>
                ) : (
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
                )}
            </NavigationContainer>
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
