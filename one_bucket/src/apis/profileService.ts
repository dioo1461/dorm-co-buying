import { AddProfileRequestBody } from '@/data/request/AddProfileRequestBody'
import { UpdateUniversityRequestBody } from '@/data/request/UpdateUniversityRequestBody'
import { GetMemberInfoResponse } from '@/data/response/getMemberInfoResponse'
import { createAuthAxios } from 'utils/axiosFactory'

/**
 * @returns:
 */
export const getProfile = async () => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get('/profile')
        .then(response => {
            return response.data
        })
        .catch(error => {
            // 401 unauthorized
            throw error
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
            console.log(`getMemberInfo error: ${error}`)
            throw error
        })
}

/**
 * @returns:
 */
export const getProfileImage = async () => {
    const authAxios = await createAuthAxios()
    return await authAxios
        .get('/profile/image', { responseType: 'arraybuffer' })
        .then(response => {
            const data = response.data
            return data
        })
        .catch(error => {
            console.log(error)
            throw error
        })
}

export const postProfile = async (data: AddProfileRequestBody) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/profile/update', data)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err
        })
}

export const updateUniversity = async (data: UpdateUniversityRequestBody) => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/member/univ', data)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err
        })
}
