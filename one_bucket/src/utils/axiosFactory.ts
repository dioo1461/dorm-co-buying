import { BASE_URL } from '@env'
import axios, { AxiosRequestConfig } from 'axios'
import { getAccessToken } from './accessTokenMethods'

export const createAxios = (options: AxiosRequestConfig = {}) => {
    return axios.create({
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        baseURL: BASE_URL,
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
        headers: { Authorization: 'Bearer ' + token },
        baseURL: BASE_URL,
        ...options,
    })

    authAxios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                // Token expired, perform logout
                // handleLogout()
            }
            return Promise.reject(error)
        },
    )
    return authAxios
}
