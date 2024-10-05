const strings = {
    // navigation screen names
    homeRouteScreenName: 'HomeRoute',
    homeScreenName: 'Home',
    groupPurchaseScreenName: 'GroupPurchase',
    tradeScreenName: 'Trade',
    boardScreenName: 'Board',
    boardCreatePostScreenName: 'BoardCreatePost',
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

    postGroupPurchaseScreenName: 'PostGroupPurchase',
    profileDetailsScreenName: 'ProfileDetails',
    profileModifyScreenName: 'ProfileModify',
    
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
    announcementScreenName: 'Announcement',
    supportScreenName: 'Support',
    versionCheckScreenName: 'VersionCheck',

    imageEnlargementScreenName: 'ImageEnlargement',

    // navigation screen titles
    homeRouteScreenTitle: '한바구니',
    homeScreenTitle: '홈',
    groupPurchaseScreenTitle: '공동구매',
    tradeScreenTitle: '중고거래',
    boardScreenTitle: '게시판',
    boardCreatePostScreenTitle: '게시글 작성',
    boardPostScreenTitle: '게시글',

    chatListScreenTitle: '채팅',
    chatScreenTitle: '채팅',
    myPageScreenTitle: 'MY',

    settingScreenTitle: '설정',
    // searchScreenTitle: '검색',
    notificationScreenTitle: '알림',
    alertSettingScreenTitle: '알림 수신 설정',
    announcementScreenTitle: '공지사항',
    supportScreenTitle: '개발자 문의',
    versionCheckScreenTitle: '버전 정보',

    postGroupPurchaseScreenTitle: '공동구매 글 작성',
    // profileDetailsScreenTitle: 'ProfileDetails',
    // profileModifyScreenTitle: 'ProfileModify',
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

    duplicatedNickname: '중복된 닉네임이 존재해요.',
    invalidNicknameLength: '닉네임은 4자 이상 14자 이하로 설정해야 해요.',
    unappropriateNickname: '닉네임에 적절하지 못한 단어가 포함되어 있어요.',

    duplicatedEmailOrNickname: '중복된 이메일 또는 닉네임이 존재해요.',

    wrongPassword: '비밀번호가 일치하지 않아요.'
}
