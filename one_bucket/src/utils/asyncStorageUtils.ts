import AsyncStorage from '@react-native-async-storage/async-storage'

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

export const setAlertSoundEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('alertSoundEnabled', value.toString())
}

export const getAlertSoundEnabled = async () => {
    return AsyncStorage.getItem('alertSoundEnabled')
}

export const setAlertVibrationEnabled = async (value: boolean) => {
    return AsyncStorage.setItem('alertVibrationEnabled', value.toString())
}

export const getAlertVibrationEnabled = async () => {
    return AsyncStorage.getItem('alertVibrationEnabled')
}

export const setLastTimestampOfChatRoom = async (
    roomId: string,
    timestamp: string,
) => {
    return AsyncStorage.setItem(`chatRoomLastTimestamp:${roomId}`, timestamp)
}

export const getLastTimestampOfChatRoom = async (roomId: string) => {
    return AsyncStorage.getItem(`chatRoomLastTimestamp:${roomId}`)
}
