import { useBoundStore } from '@/hooks/useStore/useBoundStore'
import { BASE_URL } from '@env'
import axios, { AxiosRequestConfig } from 'axios'
import { getAccessToken } from './accessTokenUtils'

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
    const token = await getAccessToken();
    console.log(token)
    const authAxios = axios.create({
        headers: { Authorization: `Bearer ${token}` },
        baseURL: 'http://jack8226.ddns.net:8080/',
        ...options,
    })
    authAxios.interceptors.request.use(
        (config) => {
            console.log('Request config: ' + config.baseURL + config.url)
            return config
        },
        (error) => {
            console.log('Request Error: ' + error)
            return error
        } 
    )
    authAxios.interceptors.response.use(
        response => {
            console.log("Response: " + response)
            return response
        },
        error => {
            if (error.response && error.response.status === 401) {
                // Token expired, perform logout
                useBoundStore.setState({ loginState: false })
            }
            return Promise.reject(error)
        },
    )
    return authAxios
}
