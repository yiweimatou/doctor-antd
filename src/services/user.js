import ApiClient from './ApiClient.js'
import {
    USER_GET_API,
    USER_LIST_API
} from '../constants/api.js'

export function getUser(params){
    return ApiClient.get(USER_GET_API,params)
}

export function getUserList(params){
    return ApiClient.get(USER_LIST_API,params)
}