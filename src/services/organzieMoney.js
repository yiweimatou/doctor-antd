import ApiClient from './ApiClient'
import { 
    ORGANIZEMONEY_LIST_API,
    ORGANIZEMONEY_INFO_API
 } from '../constants/api'

export function fetchList(params) {
    return ApiClient.get(ORGANIZEMONEY_LIST_API, params)
}

export function fetchInfo(params) {
    return ApiClient.get(ORGANIZEMONEY_INFO_API, params)
}