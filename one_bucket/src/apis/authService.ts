import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { SignUpRequestBody } from '@/data/request/signUpRequestBody'
import { storeAccessToken, storeRefreshToken } from 'utils/accessTokenMethods'
import { defaultAxios } from 'utils/axiosFactory'

export const submitSignupForm = async (
    data: SignUpRequestBody,
): Promise<boolean> => {
    return await defaultAxios
        .post('/register', data)
        .then(res => {
            return true
        })
        .catch(err => {
            return false
        })
}

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const requestLogin = async (data: LoginRequestBody) => {
    return defaultAxios
        .post('/sign-in', data)
        .then(response => {
            storeAccessToken(response.data.accessToken)
            if (response.data.refreshToken) {
                storeRefreshToken(response.data.refreshToken)
            }
            return true
        })
        .catch(error => {
            // 401 unauthorized
            return false
        })
}

export const getNickname = async (id: string) => {
    return defaultAxios
        .get(`/member/${id}/nickname`)
        .then(response => {
            return response.data
        })
        .catch(error => {
            return ''
        })
}
