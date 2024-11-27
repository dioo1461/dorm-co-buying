import AsyncStorage from '@react-native-async-storage/async-storage'

// ########## AUTH ##########
export const setLoginInitFlag = async (value: boolean) => {
    return AsyncStorage.setItem('loginInitFlag', value.toString())
}

export const getLoginInitFlag = async () => {
    return AsyncStorage.getItem('loginInitFlag')
}

export const setAutoLoginEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('autoLoginEnabled', value.toString())
}

export const getAutoLoginEnabled = async () => {
    return AsyncStorage.getItem('autoLoginEnabled')
}

// ########## CHATROOM ##########

export const setLastTimestampOfChatRoom = async (
    roomId: string,
    timestamp: string,
) => {
    return AsyncStorage.setItem(`chatRoomLastTimestamp:${roomId}`, timestamp)
}

export const getLastTimestampOfChatRoom = async (roomId: string) => {
    return AsyncStorage.getItem(`chatRoomLastTimestamp:${roomId}`)
}

export const setChatRoomNotificationEnabled = async (
    roomId: string,
    enabled: boolean,
) => {
    return AsyncStorage.setItem(
        `chatRoomNotificationEnabled:${roomId}`,
        enabled.toString(),
    )
}

export const getChatRoomNotificationEnabled = async (roomId: string) => {
    return (
        (await AsyncStorage.getItem(
            `chatRoomNotificationEnabled:${roomId}`,
        )) !== 'false'
    )
}

// 서버 단에서 구현됨
// export const setChatRoomNotificationEnabled = async (
//     chatRoomId: string,
//     enabled: boolean,
// ) => {
//     return AsyncStorage.setItem(
//         `chatRoomNotificationEnabled:${chatRoomId}`,
//         enabled.toString(),
//     )
// }
//
// export const getChatRoomNotificationEnabled = async (chatRoomId: string) => {
//     return AsyncStorage.getItem(`chatRoomNotificationEnabled:${chatRoomId}`)
// }

// ########## PARTIAL SETTINGS ##########

export const setPostNotificationEnabled = async (
    postId: number,
    enabled: boolean,
) => {
    return AsyncStorage.setItem(
        `postNotificationEnabled:${postId}`,
        enabled.toString(),
    )
}

export const getPostNotificationEnabled = async (postId: string) => {
    return (
        (await AsyncStorage.getItem(`postNotificationEnabled:${postId}`)) !==
        'false'
    )
}

// ########## GLOBAL SETTINGS ##########

export const setGlobalAlertSoundEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('alertSoundEnabled', value.toString())
}

export const getGlobalAlertSoundEnabled = async () => {
    return (await AsyncStorage.getItem('alertSoundEnabled')) !== 'false'
}

export const setGlobalAlertVibrationEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('alertVibrationEnabled', value.toString())
}

export const getGlobalAlertVibrationEnabled = async () => {
    return (await AsyncStorage.getItem('alertVibrationEnabled')) !== 'false'
}

export const setGlobalCommentNotificationEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('commentNotificationEnabled', value.toString())
}

export const getGlobalCommentNotificationEnabled = async () => {
    return (
        (await AsyncStorage.getItem('commentNotificationEnabled')) !== 'false'
    )
}

export const setGlobalChatNotificationEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('chatNotificationEnabled', value.toString())
}

export const getGlobalChatNotificationEnabled = async () => {
    return (await AsyncStorage.getItem('chatNotificationEnabled')) !== 'false'
}
