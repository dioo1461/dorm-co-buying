import AsyncStorage from '@react-native-async-storage/async-storage'

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

export const cacheBoardPostList = async (
    boardId: number,
    page: number,
    data: any,
) => {
    return AsyncStorage.setItem()
}
