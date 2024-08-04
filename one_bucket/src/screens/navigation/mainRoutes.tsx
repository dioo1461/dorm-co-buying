/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import strings from '@/constants/strings'
import IcSetting from 'assets/drawable/ic-setting.svg'
import IcMenu from 'assets/mipmap/tab/ic-menu.svg'
import IcNotification from 'assets/mipmap/tab/ic-notification.svg'
import IcOther from 'assets/mipmap/tab/ic-other.svg'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Chat from 'screens/Chat'
import Home from 'screens/Home'
import Mypage from 'screens/Mypage'
export const mainRoutes = [
    {
        name: strings.homeScreenName,
        component: Home,
        inactiveIcon: require('assets/mipmap/tab/icon_home_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_home_active.png'),
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
        inactiveIcon: require('assets/mipmap/tab/icon_chat_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_chat_active.png'),
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
        inactiveIcon: require('assets/mipmap/tab/icon_mypage_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_mypage_active.png'),
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 8,
                    }}>
                    <IcSetting fill='white' />
                </TouchableOpacity>
            </View>
        ),
    },
]

const styles = StyleSheet.create({
    icOther: {
        width: 24,
        height: 24,
        marginEnd: 4,
        color: 'black',
    },
})
