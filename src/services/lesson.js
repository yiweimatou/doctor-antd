import ApiClient from './ApiClient.js'
import { 
    LESSON_ADD_API,
    LESSON_GET_API,
    LESSON_REMOVE_API,
    LESSON_EDIT_API,
    LESSON_LIST_API,
    LESSON_INFO_API,
    LESSON_PUT_CET_API,
    LESSON_MONEY_INFO_API,
    LESSON_MONEY_LIST_API
} from '../constants/api.js'

export function newLesson(params){
    return ApiClient.post(LESSON_ADD_API,params,{needAuth:true})
}

export function getLesson(params){
    return ApiClient.get( LESSON_GET_API,params )
}

export function deleteLesson(params){
    return ApiClient.delete( LESSON_REMOVE_API,params )
}

export function editLesson(params){
    return ApiClient.put( LESSON_EDIT_API,params )
}

export function listLesson(params){
    return ApiClient.get( LESSON_LIST_API,params)
}

export function infoLesson(params){
    return ApiClient.get(LESSON_INFO_API,params)
}

export function putcetLesson(params){
    return ApiClient.put(LESSON_PUT_CET_API,params)
}

export function fetchLessonMoneyList(params) {
    return ApiClient.get(LESSON_MONEY_LIST_API, params)
}

export function fetchLessonMoneyInfo(params) {
    return ApiClient.get(LESSON_MONEY_INFO_API, params)
}