import { LoginRequestBody } from '@/data/request/LoginRequestBody'
import { SetUniversityRequestBody } from '@/data/request/SetUniversityRequestBody'
import {
    PhoneRequestBody,
    SchoolAuthRequestBody,
    SignUpRequestBody,
} from '@/data/request/SignUpRequestBody'
import {
    PhoneResponse,
    SchoolAuthResponse,
    LoginResponse,
} from '@/data/response/success/LoginResponse'
import { SetUniversityResponse } from '@/data/response/success/SetUniversityResponse'
import { createAuthAxios, createAxios } from 'utils/axiosFactory'

export const postPhoneForm = async (data: PhoneRequestBody): Promise<any> => {
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

export const postSchoolForm = async (
    data: SchoolAuthRequestBody,
): Promise<any> => {
    const authAxios = await createAuthAxios()
    // console.log("data:",data)
    return authAxios
        .post('/univ/send-code', data)
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
    console.log('data:', data)
    return authAxios
        .post('/univ/verify-code', data)
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

export const requestPhone = async (
    data: PhoneRequestBody,
): Promise<PhoneResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/sign-in', data)
        .then(response => {
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

export const requestSchool = async (
    data: SchoolAuthRequestBody,
): Promise<SchoolAuthResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/sign-in', data)
        .then(response => {
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

export const requestLogin = async (
    data: LoginRequestBody,
): Promise<LoginResponse> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/sign-in', data)
        .then(response => {
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
