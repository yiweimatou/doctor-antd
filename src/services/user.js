import ApiClient from './ApiClient.js'
import {USER_GET_API} from '../constants/api.js'

export function getUser(params){
    return ApiClient.get(USER_GET_API,params)
}