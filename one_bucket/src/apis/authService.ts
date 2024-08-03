import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { SignUpRequestBody } from '@/data/request/signUpRequestBody'
import { LoginResponse } from '@/data/response/LogInResponse'
import { createAuthAxios, createAxios } from 'utils/axiosFactory'

export const submitSignupForm = async (
    data: SignUpRequestBody,
): Promise<any> => {
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
            return response.data
        })
        .catch(error => {
            // console.log(error)
            // 401 unauthorized
            throw error
        })
}
