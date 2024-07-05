import { SignUpRequestBody } from '@/data/request/signUpRequestBody'
import { authAxios, defaultAxios } from 'utils/axiosFactory'

export const checkEmailUnique = async (email: String) => {
    const params = { email: email }
    const res = await defaultAxios.get('/users', { params })

    if (res.data === '') {
        return true
    } else {
        return false
    }
}

export const checkUsernameUnique = async (username: String) => {
    const params = { username: username }
    const res = await defaultAxios.get('/users', { params })

    if (res.data === '') {
        return true
    } else {
        return false
    }
}

/**  */
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

export const updateAuthInfo = async (data: SignUpRequestBody) => {
    return await authAxios.patch('/users', data).then(res => {})
}
