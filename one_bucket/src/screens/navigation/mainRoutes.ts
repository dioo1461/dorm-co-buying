/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import Home from 'screens/Home'
import Search from 'screens/Search'
import Chat from 'screens/Chat'
import Mypage from 'screens/Mypage'
import strings from '@/constants/strings'

export const mainRoutes = [
    {
        name: strings.homeScreenName,
        component: Home,
        inactiveIcon: require('res/mipmap/tab/icon_home_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_home_active.png'),
    },
    {
        name: strings.chatScreenName,
        component: Chat,
        inactiveIcon: require('res/mipmap/tab/icon_chat_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_chat_active.png'),
    },
    {
        name: strings.myPageScreenName,
        component: Mypage,
        inactiveIcon: require('res/mipmap/tab/icon_mypage_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_mypage_active.png'),
    },
]
