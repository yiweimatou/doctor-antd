import ApiClient from './ApiClient.js'
import {
    USER_GET_API,
    USER_LIST_API,
    USER_MONEY_INFO_API,
    USER_MONEY_LIST_API,
    USER_ALIPAY_SET_API
} from '../constants/api.js'

export function getUser(params){
    return ApiClient.get(USER_GET_API,params)
}

export function getUserList(params){
    return ApiClient.get(USER_LIST_API,params)
}

export function fetchUserMoneyList(params) {
    return ApiClient.get(USER_MONEY_LIST_API, params, {needAuth: true})
}

export function fetchUserMoneyInfo(params) {
    return ApiClient.get(USER_MONEY_INFO_API, params,{needAuth: true})
}

export function updateUserAlipay(params) {
    return ApiClient.post(USER_ALIPAY_SET_API, params)
}