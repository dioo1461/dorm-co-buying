import { CreateBoardPostRequestBody } from '@/data/request/CreateBoardPostRequestBody'
import { createAuthAxios } from '@/utils/axiosFactory'

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const createBoardPost = async (
    data: CreateBoardPostRequestBody,
): Promise<CreateBoardPostRequestBody> => {
    const authAxios = await createAuthAxios()
    return authAxios
        .post('/board/post', data)
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
