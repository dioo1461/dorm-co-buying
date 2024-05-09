/**
 * custom tab icons
 * https://webruden.tistory.com/186
 */

import Home from 'screens/Home'
import Search from 'screens/Search'
import Chat from 'screens/Chat'
import Mypage from 'screens/Mypage'

export const mainRoutes = [
    {
        name: '홈',
        component: Home,
        inactiveIcon: require('res/mipmap/tab/icon_home_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_home_active.png'),
    },
    {
        name: '채팅',
        component: Chat,
        inactiveIcon: require('res/mipmap/tab/icon_chat_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_chat_active.png'),
    },
    {
        name: 'MY',
        component: Mypage,
        inactiveIcon: require('res/mipmap/tab/icon_mypage_inactive.png'),
        activeIcon: require('res/mipmap/tab/icon_mypage_active.png'),
    },
]
