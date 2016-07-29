import ApiClient from './ApiClient'
import { USER_LOGIN_API } from '../constants/api.js'

export function login(mobile,password) {
    return ApiClient.post(USER_LOGIN_API,{
        mobile,
        pwd:password,
        type:2
    })
}