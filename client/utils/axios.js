import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import cookie from 'js-cookie'

function getRefeshToken(){
    return cookie.get("refresh_token")
}
let r_data = {
    refresh_token: getRefeshToken()
}
const refreshAuthLogic = failedRequest => axios.post(`${process.env.API_URL}/token/refresh`, JSON.stringify(r_data)).then(tokenRefreshResponse => {
    cookie.remove('access_token')
    cookie.remove('refresh_token')
    cookie.set('access_token', tokenRefreshResponse.data.access_token);
    cookie.set('refresh_token', tokenRefreshResponse.data.refresh_token);
    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + tokenRefreshResponse.data.access_token;
    return Promise.resolve();
}).catch((err) => {
    console.log(err)
});

const authAxios = axios.create({
    baseURL: process.env.API_URL,
})

function getToken(){
    return cookie.get("access_token")
}

authAxios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json'
        return config;
    },
    error => {
        Promise.reject(error)
    });

axios.defaults.headers.post["Content-Type"] = "application/json"
axios.defaults.headers.get["Accept"] = "application/json"

authAxios.interceptors.response.use(createAuthRefreshInterceptor(authAxios, refreshAuthLogic))

export default authAxios;