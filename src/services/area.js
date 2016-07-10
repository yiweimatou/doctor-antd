
import ApiClient from './ApiClient.js'
import {AREA_LIST_API,AREA_GET_API} from '../constants/api.js'

export function getAreaList(params){
    return ApiClient.get( AREA_LIST_API,params )
}

export function getArea(params){
    return ApiClient.get(AREA_GET_API,params)
}