import { defaultAxios, authAxios } from 'utils/axiosFactory'
import { storeAccessToken, storeRefreshToken } from 'utils/accessTokenMethods'

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const requestLogin = async (data: Object) => {
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
            return error
        })
}

export const checkPassword = async (password: String) => {
    return authAxios
        .post('/auth/check-password', { password: password })
        .then(res => {
            if (res.data) {
                return true
            }
            return false
        })
        .catch(err => {
            throw err
        })
}
