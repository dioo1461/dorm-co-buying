import { defaultAxios, authAxios } from "utils/axiosFactory";
import { storeAccessToken } from "utils/accessTokenMethods";

/** API서버에 Login 요청을 보내고, 토큰을 localStorage에 저장
 * @returns: 요청 성공시 true, 요청 실패시 false 반환
 */
export const requestLogin = async (data: JSON) => {
    return defaultAxios.post('/auth/login', data)
        .then(response => {
            storeAccessToken(response.data.access_token);
            return true;
        })
        .catch(error => { // 401 unauthorized
            return false;
        });
}

export const checkPassword = async (password: String) => {
    return authAxios.post('/auth/check-password', {password: password})
    .then(res => {
        if (res.data) {
            return true;
        }
        return false;
    })
    .catch(err => {
        throw err;
    })
}