import jwtDecode from 'jwt-decode'
import EncryptedStorage from 'react-native-encrypted-storage'

const ACCESS_TOKEN_NAME = 'accessToken'
const REFRESH_TOKEN_NAME = 'refreshToken'

export const removeAccessToken = () => {
    EncryptedStorage.removeItem(ACCESS_TOKEN_NAME)
}

export const removeRefreshToken = () => {
    EncryptedStorage.removeItem(REFRESH_TOKEN_NAME)
}

export const checkAccessTokenAvailable = async () => {
    if (await EncryptedStorage.getItem(ACCESS_TOKEN_NAME)) {
        return true
    } else {
        return false
    }
}

export const storeAccessToken = async (jwt: string) => {
    return EncryptedStorage.setItem(ACCESS_TOKEN_NAME, jwt)
}

export const storeRefreshToken = async (jwt: string) => {
    return EncryptedStorage.setItem(REFRESH_TOKEN_NAME, jwt)
}

export const getAccessToken = async () => {
    return EncryptedStorage.getItem(ACCESS_TOKEN_NAME)
}

export const getRefreshToken = async () => {
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
