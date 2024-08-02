import { LoginRequestBody } from '@/data/request/loginRequestBody'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { createAuthAxios } from 'utils/axiosFactory'

/**
 * @returns:
 */
export const getProfile = async (data: LoginRequestBody) => {
    const authAxios = await createAuthAxios()
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

/**
 * @returns:
 */
export const getMemberInfo = async () => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get('/member/info')
        .then(response => {
            const data: GetMemberInfoResponse = response.data
            return data
        })
        .catch(error => {
            console.log(error)
            return error
        })
}

/**
 * @returns:
 */
export const getProfileImage = async () => {
    const authAxios = await createAuthAxios()
    return await authAxios
        .get('/profile/image')
        .then(response => {
            const data: GetMemberInfoResponse = response.data
            return data
        })
        .catch(error => {
            console.log(error)
            return error
        })
}
