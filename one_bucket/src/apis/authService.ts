import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { SignUpRequestBody } from '@/data/request/signUpRequestBody'
import { storeAccessToken, storeRefreshToken } from 'utils/accessTokenMethods'
import { createAuthAxios, createAxios } from 'utils/axiosFactory'

export const submitSignupForm = async (
    data: SignUpRequestBody,
): Promise<boolean> => {
    return await createAxios()
        .post('/register', data)
        .then(res => {
            return true
        })
        .catch(error => {
            // console.log(error)
            return false
        })
}

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const requestLogin = async (data: LoginRequestBody) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/sign-in', data)
        .then(response => {
            storeAccessToken(response.data.accessToken)
            if (response.data.refreshToken) {
                storeRefreshToken(response.data.refreshToken)
            }
            return true
        })
        .catch(error => {
            // console.log(error)
            // 401 unauthorized
            return false
        })
}
