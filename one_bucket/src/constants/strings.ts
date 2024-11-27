import { updateGroupTradePost } from '@/apis/groupTradeService'

const strings = {
    // navigation screen names
    homeRouteScreenName: 'HomeRoute',
    homeScreenName: 'Home',
    groupTradeScreenName: 'GroupTrade',
    groupTradePostScreenName: 'GroupTradePost',
    usedTradeScreenName: 'UsedTrade',
    boardScreenName: 'Board',
    boardCreatePostScreenName: 'CreateBoardPost',
    updateBoardPostScreenName: 'UpdateBoardPost',
    boardPostScreenName: 'BoardPost',

    chatListScreenName: 'ChatList',
    chatScreenName: 'Chat',
    myPageScreenName: 'MY',

    searchScreenName: 'Search',
    notificationScreenName: 'Notification',

    loginScreenName: 'Login',
    /*
    signUp1ScreenName: 'SignUp',
    signUp2ScreenName: 'SignUp2',
    signUp3ScreenName: 'SignUp3',
    signUp4ScreenName: 'SignUp4', */
    signUp5ScreenName: 'SignUp5',
    signUp6ScreenName: 'SignUp6',
    signUp7ScreenName: 'SignUp7',
    newPwScreenName: 'NewPw',
    newPw2ScreenName: 'NewPw2',

    unauthHomeScreenName: 'UnauthHome',

    createGroupTradePostScreenName: 'CreateGroupTradePost',
    updateGroupTradePostScreenName: 'UpdateGroupTradePost',

    usedTradePostScreenName: 'UsedTradePost',
    createUsedTradePostScreenName: 'CreateUsedTradePost',
    updateUsedTradePostScreenName: 'UpdateUsedTradePost',

    profileDetailsScreenName: 'ProfileDetails',
    profileModifyScreenName: 'ProfileModify',
    myLikedPostsScreenName: 'MyLikedPosts',
    myBoardPostsScreenName: 'MyBoardPosts',
    myGroupTradePostsScreenName: 'MyGroupTradePosts',
    joinedGroupTradePostsScreenName: 'JoinedGroupTradePosts',

    settingScreenName: '설정',
    schoolAuth1ScreenName: 'SchoolAuth1',
    schoolAuth2ScreenName: 'SchoolAuth2',
    schoolAuth3ScreenName: 'SchoolAuth3',
    phoneAuth1ScreenName: 'PhoneAuth1',
    phoneAuth2ScreenName: 'PhoneAuth2',
    phoneAuth3ScreenName: 'PhoneAuth3',
    changePwScreenName: 'ChangePw',
    changePw2ScreenName: 'ChangePw2',
    alertSettingScreenName: 'AlertSetting',
    announcementListScreenName: 'AnnouncementList',
    announcementPostScreenName: 'AnnouncementPost',
    supportScreenName: 'Support',
    versionCheckScreenName: 'VersionCheck',

    imageEnlargementScreenName: 'ImageEnlargement',

    // navigation screen titles
    homeRouteScreenTitle: '한바구니',
    homeScreenTitle: '홈',
    groupTradeScreenTitle: '공동구매',
    usedTradeScreenTitle: '중고거래',
    boardScreenTitle: '게시판',
    boardCreatePostScreenTitle: '게시글 작성',
    updateBoardPostScreenTitle: '게시글 수정',
    boardPostScreenTitle: '게시글',

    chatListScreenTitle: '채팅',
    chatScreenTitle: '채팅',
    myPageScreenTitle: 'MY',

    settingScreenTitle: '설정',
    // searchScreenTitle: '검색',
    notificationScreenTitle: '알림',
    alertSettingScreenTitle: '알림 수신 설정',
    announcementListScreenTitle: '공지사항',
    announcementPostScreenTitle: '공지사항',
    supportScreenTitle: '개발자 문의',
    versionCheckScreenTitle: '버전 정보',

    createGroupTradePostScreenTitle: '공동구매 글 작성',
    updateGroupTradePostScreenTitle: '공동구매 글 수정',

    usedTradePostScreenTitle: '중고거래 게시글',
    createUsedTradePostScreenTitle: '중고거래 글 작성',
    updateUsedTradePostScreenTitle: '중고거래 글 수정',

    // profileDetailsScreenTitle: 'ProfileDetails',
    profileModifyScreenTitle: '프로필 수정',
    myLikedPostsScreenTitle: '좋아요 누른 글',
    myBoardPostsScreenTitle: '내가 쓴 게시글',
    myGroupTradePostsScreenTitle: '내가 쓴 거래글',
    joinedGroupTradePostsScreenTitle: '내가 참여한 공동구매',

    // alertSettingScreenTitle: 'AlertSetting',
    // announcementScreenTitle: 'Ann/ouncement',
    // supportScreenTitle: 'Support',

    // imageEnlargementScreenTitle: 'ImageEnlargement',
}

export default strings

export const signUpErrorMessage = {
    duplicatedEmail: '중복된 이메일이 존재해요.',

    invalidPasswordLength: '비밀번호는 8자 이상 20자 이하로 설정해야 해요.',
    invalidPasswordFormat:
        '비밀번호는 최소 1개의 대소문자와 숫자 및 특수문자를 포함해야 합니다.',
    passwordMismatch: '두 비밀번호가 일치하지 않아요.',
    passwordUnchanged: '현재와 다른 비밀번호로 설정해 주세요.',

    duplicatedNickname: '중복된 닉네임이 존재해요.',
    invalidNicknameLength: '닉네임은 4자 이상 14자 이하로 설정해야 해요.',
    unappropriateNickname: '닉네임에 적절하지 못한 단어가 포함되어 있어요.',

    duplicatedEmailOrNickname: '중복된 이메일 또는 닉네임이 존재해요.',

    wrongPassword: '비밀번호가 틀렸습니다.',
}
