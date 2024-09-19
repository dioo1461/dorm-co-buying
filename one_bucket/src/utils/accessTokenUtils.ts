import AsyncStorage from '@react-native-async-storage/async-storage'
import jwtDecode from 'jwt-decode'
import { Platform } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'

const ACCESS_TOKEN_NAME = 'accessToken'
const REFRESH_TOKEN_NAME = 'refreshToken'

export const removeAccessToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.removeItem(ACCESS_TOKEN_NAME)
    }
    return EncryptedStorage.removeItem(ACCESS_TOKEN_NAME)
}

export const removeRefreshToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.removeItem(REFRESH_TOKEN_NAME)
    }
    return EncryptedStorage.removeItem(REFRESH_TOKEN_NAME)
}

export const setAccessToken = async (jwt: string) => {
    if (Platform.OS === 'web') {
        return AsyncStorage.setItem(ACCESS_TOKEN_NAME, jwt)
    }
    return EncryptedStorage.setItem(ACCESS_TOKEN_NAME, jwt)
}

export const setRefreshToken = async (jwt: string) => {
    if (Platform.OS === 'web') {
        return AsyncStorage.setItem(REFRESH_TOKEN_NAME, jwt)
    }
    return EncryptedStorage.setItem(REFRESH_TOKEN_NAME, jwt)
}

export const getAccessToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.getItem(ACCESS_TOKEN_NAME)
    }
    return EncryptedStorage.getItem(ACCESS_TOKEN_NAME)
}

export const getRefreshToken = async () => {
    if (Platform.OS === 'web') {
        return AsyncStorage.getItem(REFRESH_TOKEN_NAME)
    }
    return EncryptedStorage.getItem(REFRESH_TOKEN_NAME)
}

export const decodeAccessToken = async () => {
    const token = await EncryptedStorage.getItem(ACCESS_TOKEN_NAME)

    if (token) {
        return jwtDecode.jwtDecode(token)
    } else {
        return null
    }
}
