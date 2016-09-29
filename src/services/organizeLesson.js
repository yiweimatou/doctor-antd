import ApiClient from './ApiClient.js'
import {
    ORGANIZELESSON_ADD_API,
    ORGANIZELESSON_EDIT_API,
    ORGANIZELESSON_INFO_API,
    ORGANIZELESSON_LIST_API,
    ORGANIZELESSON_GET_API
} from '../constants/api.js'

export function getOrganizeLesson(params) {
    return ApiClient.get(ORGANIZELESSON_GET_API, params)
}

export function getOrganizeLessonList(params){
    return ApiClient.get(ORGANIZELESSON_LIST_API,params)
}

export function addOrganizeLesson(params){
    return ApiClient.post( ORGANIZELESSON_ADD_API,params,{needAuth:true} )
}

export function editOrganizeLesson(params){
    return ApiClient.put( ORGANIZELESSON_EDIT_API,params)
}

export function getOrganizeLessonInfo(params){
    return ApiClient.get( ORGANIZELESSON_INFO_API,params )
}