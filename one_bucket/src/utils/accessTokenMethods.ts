import jwtDecode from "jwt-decode";
import { updateAuthAxiosJwt } from "./axiosFactory";

const tokenName = 'accessToken';

export const removeAccessToken = () => {
    // localStorage.removeItem(tokenName);
}

export const checkIsAccessTokenAvailable = () => {
    // if (localStorage.getItem(tokenName)) {
    //     return true;
    // }
    // return false;
    return true;
}

export const storeAccessToken = (jwt: String) => {
    // localStorage.setItem(tokenName, jwt);
    // updateAuthAxiosJwt(jwt);
}

export const getAccessToken = () => {
    // return localStorage.getItem(tokenName);
    return 'stub-token'
}

export const decodeAccessToken = async() => {
    // const token = localStorage.getItem(tokenName);
    const token = 'stub-token'
    return jwtDecode.jwtDecode(token);
}