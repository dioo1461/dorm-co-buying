import strings from '@/constants/strings'

const linking = {
    prefixes: ['app://'], // 앱에서 처리할 URL의 prefix
    config: {
        screens: {
            Home: '', // 기본 루트 경로
            Search: 'search/:keyword/:option', // 검색 페이지
            Notification: 'notification', // 알림 페이지
            ProfileDetails: 'profile/:userId', // 사용자 프로필 상세

            // 개별 스크린 매핑
            [strings.unauthHomeScreenName]: 'unauth/home',
            [strings.createGroupTradePostScreenName]: 'group-trade/create-post',
            [strings.groupTradePostScreenName]: 'group-trade/:postId',
            [strings.profileDetailsScreenName]: 'profile/:userId',
            [strings.profileModifyScreenName]: 'profile/modify',
            [strings.settingScreenName]: 'settings',
            [strings.schoolAuth1ScreenName]: 'auth/school/step1',
            [strings.schoolAuth2ScreenName]: 'auth/school/step2',
            [strings.schoolAuth3ScreenName]: 'auth/school/step3',
            [strings.changePwScreenName]: 'auth/change-password/step1',
            [strings.changePw2ScreenName]: 'auth/change-password/step2',
            [strings.alertSettingScreenName]: 'settings/alerts',
            [strings.announcementListScreenName]: 'announcements',
            [strings.announcementPostScreenName]: 'announcement/:postId',
            [strings.supportScreenName]: 'support',
            [strings.versionCheckScreenName]: 'settings/version',
            [strings.boardCreatePostScreenName]: 'board/create-post',
            [strings.updateBoardPostScreenName]: 'board/update-post/:postId',
            [strings.boardPostScreenName]: 'board/:postId',
            [strings.imageEnlargementScreenName]: 'image-enlargement',
            [strings.chatScreenName]: 'chat/:roomId',
            [strings.myLikedPostsScreenName]: 'profile/liked-posts',
            [strings.myBoardPostsScreenName]: 'profile/board-posts',
            [strings.myGroupTradePostsScreenName]: 'profile/group-trade-posts',
        },
    },
}

export default linking
