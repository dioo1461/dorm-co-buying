/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import IcSetting from '@/assets/drawable/ic-setting.svg'
import IcTabChatActive from '@/assets/drawable/tab/ic-tab-chat-active.svg'
import IcTabChatInactive from '@/assets/drawable/tab/ic-tab-chat-inactive.svg'
import IcTabHomeActive from '@/assets/drawable/tab/ic-tab-home-active.svg'
import IcTabHomeInactive from '@/assets/drawable/tab/ic-tab-home-inactive.svg'

import IcTabProfileActive from '@/assets/drawable/tab/ic-tab-profile-active.svg'
import IcTabProfileInactive from '@/assets/drawable/tab/ic-tab-profile-inactive.svg'
import IcMenu from '@/assets/mipmap/tab/ic-menu.svg'
import IcNotification from '@/assets/mipmap/tab/ic-notification.svg'
import IcOther from '@/assets/mipmap/tab/ic-other.svg'
import { baseColors } from '@/constants/colors'
import strings from '@/constants/strings'
import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Chat from 'screens/Chat'
import Mypage from 'screens/Mypage'
import HomeRoutes from 'screens/navigation/HomeRoutes'

export const mainRoutes = [
    {
        name: strings.homeScreenName,
        component: HomeRoutes,
        activeIconLight: <IcTabHomeActive fill={baseColors.SCHOOL_BG} />,
        inactiveIconLight: <IcTabHomeInactive fill={baseColors.SCHOOL_BG} />,
        activeIconDark: <IcTabHomeActive fill={baseColors.WHITE} />,
        inactiveIconDark: <IcTabHomeInactive fill={baseColors.WHITE} />,
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 8,
                    }}>
                    <IcNotification fill='white' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 8,
                    }}>
                    <IcMenu fill='white' />
                </TouchableOpacity>
            </View>
        ),
    },
    {
        name: strings.chatScreenName,
        component: Chat,
        activeIconLight: <IcTabChatActive fill={baseColors.SCHOOL_BG} />,
        inactiveIconLight: <IcTabChatInactive fill={baseColors.SCHOOL_BG} />,
        activeIconDark: <IcTabChatActive fill={baseColors.WHITE} />,
        inactiveIconDark: <IcTabChatInactive fill={baseColors.WHITE} />,
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 8,
                    }}>
                    <IcOther fill='white' />
                </TouchableOpacity>
            </View>
        ),
    },
    {
        name: strings.myPageScreenName,
        component: Mypage,
        activeIconLight: <IcTabProfileActive fill={baseColors.SCHOOL_BG} />,
        inactiveIconLight: <IcTabProfileInactive fill={baseColors.SCHOOL_BG} />,
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
                            marginEnd: 8,
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
]
