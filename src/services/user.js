import ApiClient from './ApiClient.js'
import {
    USER_GET_API,
    USER_LIST_API,
    USER_ALIPAY_SET_API,
    CAPTCHA_API
} from '../constants/api.js'

export function getUser(params){
    return ApiClient.get(USER_GET_API,params)
}

export function getUserList(params){
    return ApiClient.get(USER_LIST_API,params)
}

export function updateUserAlipay(params) {
    return ApiClient.post(USER_ALIPAY_SET_API, params)
}

export function sendCaptcha(params) {
    return ApiClient.post(CAPTCHA_API, params)
}

export function setAlipay(params) {
    return ApiClient.put(USER_ALIPAY_SET_API, params)
}
