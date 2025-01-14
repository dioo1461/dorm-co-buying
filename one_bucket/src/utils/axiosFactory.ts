import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { BASE_URL, STORAGE_BASE_URL } from '@env'
import axios, { AxiosRequestConfig } from 'axios'
import { getAccessToken } from './accessTokenUtils'

export const createAxios = (options: AxiosRequestConfig = {}) => {
    return axios.create({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        baseURL: BASE_URL,
        maxContentLength: Infinity, // 요청 본문 크기 제한 해제
        maxBodyLength: Infinity, // POST 요청 크기 제한 해제
        ...options,
    })
}

/**
 * Creates an instance of Axios with authentication headers.
 * @param options - Additional options for Axios.
 * @returns An instance of Axios with authentication headers.
 */
export const createAuthAxios = async (options: AxiosRequestConfig = {}) => {
    const token = await getAccessToken()
    const authAxios = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: BASE_URL,
        maxContentLength: Infinity, // 요청 본문 크기 제한 해제
        maxBodyLength: Infinity, // POST 요청 크기 제한 해제
        ...options,
    })
    authAxios.interceptors.request.use(
        config => {
            console.log('Request config: ' + config.baseURL + config.url)
            return config
        },
        error => {
            console.log('Request Error: ' + error)
            return error
        },
    )
    authAxios.interceptors.response.use(
        response => {
            return response
        },
        error => {
            if (error.response && error.response.status === 401) {
                // Token expired, perform logout
                useBoundStore.setState({ loginState: false })
            }
            if (error.response === undefined) {
                console.log('error.response is undefined')
            }
            return Promise.reject(error)
        },
    )

    return authAxios
}

export const createStorageAxios = async (options: AxiosRequestConfig = {}) => {
    return axios.create({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        baseURL: STORAGE_BASE_URL,
        ...options,
    })
}

export const createAuthStorageAxios = async (
    options: AxiosRequestConfig = {},
) => {
    const token = await getAccessToken()
    return axios.create({
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        baseURL: STORAGE_BASE_URL,
        ...options,
    })
}
