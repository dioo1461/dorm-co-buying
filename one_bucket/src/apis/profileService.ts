import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { authAxios } from 'utils/axiosFactory'

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const getProfile = async (data: LoginRequestBody) => {
    return authAxios
        .post('/profile', data)
        .then(response => {
            return true
        })
        .catch(error => {
            // 401 unauthorized
            return false
        })
}
