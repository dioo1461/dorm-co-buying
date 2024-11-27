import strings from '@/constants/strings'

const linking = {
    prefixes: ['app://'],
    config: {
        screens: {
            // 로그인된 상태
            Main: {
                path: 'main',
                screens: {
                    [strings.homeRouteScreenName]: {
                        path: 'home',
                        screens: {
                            Board: {
                                path: 'board',
                                screens: {
                                    [strings.boardPostScreenName]:
                                        'post/:postId',
                                },
                            },
                            GroupTrade: {
                                path: 'group-trade',
                                screens: {
                                    [strings.groupTradePostScreenName]:
                                        'post/:postId',
                                },
                            },
                        },
                    },
                    [strings.chatListScreenName]: 'chat-list',
                    [strings.myPageScreenName]: 'my-page',
                },
            },
            // 개별 스크린들
            [strings.unauthHomeScreenName]: 'unauth-home',
            [strings.createGroupTradePostScreenName]: 'create-group-trade-post',
            [strings.groupTradePostScreenName]: 'group-trade-post/:postId',
            [strings.profileDetailsScreenName]: 'profile-details',
            [strings.profileModifyScreenName]: 'profile-modify',
            [strings.settingScreenName]: 'setting',
            [strings.schoolAuth1ScreenName]: 'school-auth-step1',
            [strings.schoolAuth2ScreenName]: 'school-auth-step2',
            [strings.schoolAuth3ScreenName]: 'school-auth-step3',
            [strings.changePwScreenName]: 'change-password',
            [strings.changePw2ScreenName]: 'change-password-confirm',
            [strings.alertSettingScreenName]: 'alert-setting',
            [strings.announcementListScreenName]: 'announcement-list',
            [strings.announcementPostScreenName]: 'announcement-post/:postId',
            [strings.supportScreenName]: 'support',
            [strings.versionCheckScreenName]: 'version-check',
            [strings.boardCreatePostScreenName]: 'create-board-post',
            [strings.updateBoardPostScreenName]: 'update-board-post/:postId',
            [strings.boardPostScreenName]: 'board-post/:postId',
            [strings.imageEnlargementScreenName]: 'image-enlargement',
            [strings.chatScreenName]: 'chat/:chatId',
            [strings.searchScreenName]: 'search',
            [strings.notificationScreenName]: 'notification',
            [strings.myLikedPostsScreenName]: 'my-liked-posts',
            [strings.myBoardPostsScreenName]: 'my-board-posts',
            [strings.myGroupTradePostsScreenName]: 'my-group-trade-posts',
            // 로그인되지 않은 상태
            Login: 'login',
            [strings.loginScreenName]: 'login',
            [strings.signUp5ScreenName]: 'sign-up-step5',
            [strings.signUp6ScreenName]: 'sign-up-step6',
            [strings.signUp7ScreenName]: 'sign-up-step7',
            [strings.newPwScreenName]: 'new-password',
            [strings.newPw2ScreenName]: 'new-password-confirm',
        },
    },
}

export default linking
