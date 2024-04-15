import axios from "axios";
import { authAxios, defaultAxios } from "utils/axiosFactory";


export const checkEmailUnique = async (email: String) => {
    const params = { email: email }
    const res = await defaultAxios.get('/users', { params });

    if (res.data === '') {
        return true;
    } else {
        return false;
    }
}

export const checkUsernameUnique = async (username: String) => {
    const params = { username: username }
    const res = await defaultAxios.get('/users', { params });

    if (res.data === '') {
        return true;
    } else {
        return false;
    }
}

/**  */
export const submitSignupForm = async (data: JSON) => {
    return await defaultAxios.post('/users', data)
    .then(res => {
        return true;
    })
    .catch(err => {
        return err;
    })
}

export const updateAuthInfo = async (data: JSON) => {
    return await authAxios.patch('/users', data)
    .then(res => {

    })

}