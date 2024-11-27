import { AddProfileRequestBody } from '@/data/request/AddProfileRequestBody'
import { SetUniversityRequestBody } from '@/data/request/SetUniversityRequestBody'
import { GetMemberInfoResponse } from '@/data/response/success/auth/GetMemberInfoResponse'
import { getAccessToken } from '@/utils/accessTokenUtils'
import {
    createAuthAxios,
    createAxios,
    createStorageAxios,
} from 'utils/axiosFactory'

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
            console.log(error.response)
            throw error
        })
}

/**
 * @returns:
 */
export const delProfile = async () => {
    const authAxios = await createAuthAxios()
    return authAxios
        .delete('/member')
        .then(response => {
            return response.data
        })
        .catch(error => {
            // 401 unauthorized
            console.log(error.response)
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
    const authAxios = await createStorageAxios()
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

export const updateProfileImage = async (image: FormData | null) => {
    if (!image) {
        const authAxios = await createAuthAxios()
        return authAxios
            .post('/profile/basic-image')
            .then(response => {
                return response
            })
            .catch(error => {
                console.log(error)
                throw error
            })
    } else {
        const token = await getAccessToken()
        const axios = createAxios({
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        })
        return axios
            .post('/profile/image', image)
            .then(response => {
                return response
            })
            .catch(error => {
                console.log(error)
                throw error
            })
    }
}

/**
 * @returns:
 */
export const postProfile = async (data: AddProfileRequestBody) => {
    const authAxios = await createAuthAxios()
    console.log('AddProfileRequestBody:', data)
    return authAxios
        .post('/profile', data)
        .then(response => {
            return response
        })
        .catch(err => {
            throw err
        })
}

export const updateUniversity = async (data: SetUniversityRequestBody) => {
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

// 페이지정보들?
export const getMyPosts = async () => {
    const authAxios = await createAuthAxios()
    return authAxios
        .get('/post/list/my')
        .then(response => {
            return response.data
        })
        .catch(err => {
            throw err
        })
}
