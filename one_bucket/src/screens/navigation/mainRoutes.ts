/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import strings from '@/constants/strings'
import Chat from 'screens/Chat'
import Home from 'screens/Home'
import Mypage from 'screens/Mypage'

export const mainRoutes = [
    {
        name: strings.homeScreenName,
        component: Home,
        inactiveIcon: require('assets/mipmap/tab/icon_home_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_home_active.png'),
    },
    {
        name: strings.chatScreenName,
        component: Chat,
        inactiveIcon: require('assets/mipmap/tab/icon_chat_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_chat_active.png'),
    },
    {
        name: strings.myPageScreenName,
        component: Mypage,
        inactiveIcon: require('assets/mipmap/tab/icon_mypage_inactive.png'),
        activeIcon: require('assets/mipmap/tab/icon_mypage_active.png'),
    },
]
