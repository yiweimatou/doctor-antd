import ApiClient from './ApiClient.js'
import {
    ORGANIZE_GET_API,
    ORGANIZE_LIST_API,
    ORGANIZE_INFO_API
} from '../constants/api'

export function getOrganize(params){
    return ApiClient.get(ORGANIZE_GET_API,params)
}

export function getOrganizeList(params){
    return ApiClient.get(ORGANIZE_LIST_API,params)
}

export function getOrganizeInfo(params){
    return ApiClient.get(ORGANIZE_INFO_API,params)
}