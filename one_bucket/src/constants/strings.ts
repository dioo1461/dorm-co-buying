const strings = {
    // navigation screen names
    homeRouteScreenName: ' 홈 ',
    homeScreenName: '홈',
    groupPurchaseScreenName: '공동구매',
    tradingScreenName: '중고거래',
    freeboardScreenName: '게시판',
    boardCreatePostScreenName: 'BoardCreatePost',
    boardPostScreenName: 'BoardPost',

    chatScreenName: '채팅',
    myPageScreenName: 'MY',

    loginScreenName: 'Login',
    signUp1ScreenName: 'SignUp',
    signUp2ScreenName: 'SignUp2',
    signUp3ScreenName: 'SignUp3',
    signUp4ScreenName: 'SignUp4',
    signUp5ScreenName: 'SignUp5',
    signUp6ScreenName: 'SignUp6',
    signUp7ScreenName: 'SignUp7',

    postGroupPurchaseScreenName: 'PostGroupPurchase',
    profileDetailsScreenName: 'ProfileDetails',
    profileModifyScreenName: 'ProfileModify',
    settingScreenName: '설정',

    imageEnlargementScreenName: 'ImageEnlargement',
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
}
