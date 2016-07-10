import ApiClient from './ApiClient'
import {
    SECTION_ADD_API,
    SECTION_GET_API,
    SECTION_EDIT_API,
    SECTION_LIST_API,
    SECTION_INFO_API
} from '../constants/api'

export function getSection(params) {
    return ApiClient.get(SECTION_GET_API,params)
}

export function getSectionList(params) {
    return ApiClient.get(SECTION_LIST_API,params)
}

export function editSection(params) {
    return ApiClient.put(SECTION_EDIT_API,params)
}

export function newSection(params) {
    return ApiClient.post(SECTION_ADD_API,params,{needAuth:true})
}

export function getSectionInfo(params) {
    return ApiClient.get(SECTION_INFO_API,params)
}