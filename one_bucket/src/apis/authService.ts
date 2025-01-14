import { LoginRequestBody } from '@/data/request/LoginRequestBody'
import { SetUniversityRequestBody } from '@/data/request/SetUniversityRequestBody'
import {
    PhoneRequestBody,
    SchoolAuthRequestBody,
    CodeValRequestBody,
    NewPwRequestBody,
    ChangePwRequestBody,
    SignUpRequestBody,
} from '@/data/request/SignUpRequestBody'
import { LoginResponse } from '@/data/response/success/auth/LoginResponse'
import { SetUniversityResponse } from '@/data/response/success/auth/SetUniversityResponse'
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
} from '@/utils/accessTokenUtils'
import { createAuthAxios, createAxios } from 'utils/axiosFactory'

export const postSchoolForm = async (
    data: SchoolAuthRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    console.log('SchoolAuthRequestBody:', data)
    return authAxios
        .post('/guest/univ/send-code', data)
        .then(res => {
            return res
        })
        .catch(error => {
            // console.log(error)
            throw error
        })
}

export const postCodeForm = async (data: any): Promise<any> => {
    const authAxios = await createAuthAxios()
    console.log('CodeValRequestBody:', data)
    return authAxios
        .post('/guest/univ/verify-code', data)
        .then(res => {
            return res
        })
        .catch(error => {
            // console.log(error)
            throw error
        })
}

export const postNewPwForm = async (data: NewPwRequestBody): Promise<any> => {
    const authAxios = await createAuthAxios()
    console.log('NewPwRequestBody:', data)
    return authAxios
        .post('/member/password/reset', data)
        .then(res => {
            return res
        })
        .catch(error => {
            // console.log(error)
            throw error
        })
}

export const postChangePwForm = async (
    data: ChangePwRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    console.log('ChangePwRequestBody:', data)
    return authAxios
        .post('/member/password/set', data)
        .then(res => {
            return res
        })
        .catch(error => {
            // console.log(error)
            throw error
        })
}

export const postSignupForm = async (data: SignUpRequestBody): Promise<any> => {
    return await createAxios()
        .post('/register', data)
        .then(res => {
            return res
        })
        .catch(error => {
            // console.log(error)
            throw error
        })
}

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */

export const requestLogin = async (
    data: LoginRequestBody,
): Promise<LoginResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/sign-in', data)
        .then(response => {
            setAccessToken(response.data.accessToken)
            return response.data
        })
        .catch(error => {
            console.log(error)
            // 401 unauthorized
            if (error.response.status === 401 || 403) {
                // onLogOut(false)
            }
            throw error
        })
}

export const setUniversity = async (
    data: SetUniversityRequestBody,
): Promise<SetUniversityResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .put('/member/univ', data)
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log(error)
            throw error
        })
}

export const requestAccessTokenRenew = async (): Promise<LoginResponse> => {
    const axios = createAxios()
    const [accessToken, refreshToken] = await Promise.all([
        getAccessToken(),
        getRefreshToken(),
    ])

    return axios
        .post('/refresh-token', {
            accessToken: accessToken,
            refreshToken: refreshToken,
        })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('requestAccessTokenRenew error -', error)
            throw error
        })
}

export const submitFCMDeviceToken = async (fcmToken: string) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/device-token/register', { token: fcmToken })
        .then(response => {
            return response.data
        })
        .catch(error => {
            console.log('registerFCMDeviceToken error -', error)
            throw error
        })
}
