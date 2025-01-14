/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import IcNotification from '@/assets/drawable/ic-notification-2.svg'
import IcSearch from '@/assets/drawable/ic-search.svg'
import IcSetting from '@/assets/drawable/ic-setting.svg'
import IcTabChatActive from '@/assets/drawable/tab/ic-tab-chat-active.svg'
import IcTabChatInactive from '@/assets/drawable/tab/ic-tab-chat-inactive.svg'
import IcTabHomeActive from '@/assets/drawable/tab/ic-tab-home-active.svg'
import IcTabHomeInactive from '@/assets/drawable/tab/ic-tab-home-inactive.svg'
import IcTabProfileActive from '@/assets/drawable/tab/ic-tab-profile-active.svg'
import IcTabProfileInactive from '@/assets/drawable/tab/ic-tab-profile-inactive.svg'
import { baseColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ChatList from 'screens/chat/ChatList'
import Mypage from '@/screens/myPage/Mypage'
import HomeTab from 'screens/navigation/HomeTab'
import UnauthHome from 'screens/UnauthHome'
import { stackNavigation } from './NativeStackNavigation'
import { useEffect, useState } from 'react'
import { useBoundStore } from '@/hooks/useStore/useBoundStore'

export const mainRoutes = [
    [
        // 학교 인증 돼있을 시
        {
            name: strings.homeRouteScreenName,
            title: strings.homeRouteScreenTitle,
            tabBarLabel: strings.homeScreenTitle,
            component: HomeTab,
            activeIconLight: <IcTabHomeActive fill={baseColors.SCHOOL_BG} />,
            inactiveIconLight: (
                <IcTabHomeInactive fill={baseColors.SCHOOL_BG} />
            ),
            activeIconDark: <IcTabHomeActive fill={baseColors.WHITE} />,
            inactiveIconDark: <IcTabHomeInactive fill={baseColors.WHITE} />,
            headerRight: () => {
                const navigation = stackNavigation()
                const [notifCount, setNotifCount] = useState(0)
                const { newNotificationCount } = useBoundStore(state => ({
                    newNotificationCount: state.newNotificationCount,
                }))

                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: 8,
                            }}
                            onPress={() => navigation.navigate('Search')}>
                            {/* <IcNotification fill='white' /> */}
                            <IcSearch fill='white' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: 8,
                            }}
                            onPress={() => navigation.navigate('Notification')}>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginEnd: 8,
                                }}>
                                <IcNotification />
                                <View
                                    style={{
                                        height: 10,
                                        width: 10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginTop: -20,
                                        marginLeft: -8,
                                        borderRadius: 20,
                                        backgroundColor:
                                            newNotificationCount > 0
                                                ? 'red'
                                                : '',
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            },
        },
        {
            name: strings.chatListScreenName,
            title: strings.chatListScreenTitle,
            tabBarLabel: strings.chatListScreenTitle,
            component: ChatList,
            activeIconLight: <IcTabChatActive fill={baseColors.SCHOOL_BG} />,
            inactiveIconLight: (
                <IcTabChatInactive fill={baseColors.SCHOOL_BG} />
            ),
            activeIconDark: <IcTabChatActive fill={baseColors.WHITE} />,
            inactiveIconDark: <IcTabChatInactive fill={baseColors.WHITE} />,
            // headerRight: () => (
            //     <View style={{ flexDirection: 'row' }}>
            //         <TouchableOpacity
            //             style={{
            //                 flex: 1,
            //                 alignItems: 'center',
            //                 justifyContent: 'center',
            //                 marginEnd: 15,
            //             }}>
            //             <IcOthers fill='white' />
            //         </TouchableOpacity>
            //     </View>
            // ),
        },
        {
            name: strings.myPageScreenName,
            title: strings.myPageScreenTitle,
            tabBarLabel: strings.myPageScreenTitle,
            component: Mypage,
            activeIconLight: <IcTabProfileActive fill={baseColors.SCHOOL_BG} />,
            inactiveIconLight: (
                <IcTabProfileInactive fill={baseColors.SCHOOL_BG} />
            ),
            activeIconDark: <IcTabProfileActive fill={baseColors.WHITE} />,
            inactiveIconDark: <IcTabProfileInactive fill={baseColors.WHITE} />,
            headerRight: () => {
                const navigation = useNavigation()
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: 15,
                            }}
                            onPress={() =>
                                navigation.navigate(strings.settingScreenName)
                            }>
                            <IcSetting fill='white' />
                        </TouchableOpacity>
                    </View>
                )
            },
        },
    ],
    [
        // 학교 인증 안돼있을 시
        {
            name: strings.unauthHomeScreenName,
            title: strings.homeRouteScreenTitle,
            tabBarLabel: strings.homeScreenTitle,
            component: UnauthHome,
            activeIconLight: <IcTabHomeActive fill={baseColors.SCHOOL_BG} />,
            inactiveIconLight: (
                <IcTabHomeInactive fill={baseColors.SCHOOL_BG} />
            ),
            activeIconDark: <IcTabHomeActive fill={baseColors.WHITE} />,
            inactiveIconDark: <IcTabHomeInactive fill={baseColors.WHITE} />,
        },
        {
            name: strings.myPageScreenName,
            title: strings.myPageScreenTitle,
            tabBarLabel: strings.myPageScreenTitle,
            component: Mypage,
            activeIconLight: <IcTabProfileActive fill={baseColors.SCHOOL_BG} />,
            inactiveIconLight: (
                <IcTabProfileInactive fill={baseColors.SCHOOL_BG} />
            ),
            activeIconDark: <IcTabProfileActive fill={baseColors.WHITE} />,
            inactiveIconDark: <IcTabProfileInactive fill={baseColors.WHITE} />,
            headerRight: () => {
                const navigation = useNavigation()
                return (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: 15,
                            }}
                            onPress={() =>
                                navigation.navigate(strings.settingScreenName)
                            }>
                            <IcSetting fill='white' />
                        </TouchableOpacity>
                    </View>
                )
            },
        },
    ],
]
