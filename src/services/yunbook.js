import ApiClient from './ApiClient'
import {
    YUNBOOK_ADD_API,
    YUNBOOK_EDIT_API,
    YUNBOOK_GET_API,
    YUNBOOK_LIST_API,
    YUNBOOK_INFO_API
} from '../constants/api'

export function newYunbook(params) {
    return ApiClient.post(YUNBOOK_ADD_API,params,{needAuth:true})
}

export function editYunbook(params) {
    return ApiClient.put(YUNBOOK_EDIT_API,params)
}

export function getYunbookList(params) {
    return ApiClient.get(YUNBOOK_LIST_API,params)
}

export function getYunbook(params) {
    return ApiClient.get(YUNBOOK_GET_API,params)
}

export function getYunbookInfo(params) {
    return ApiClient.get(YUNBOOK_INFO_API,params)
}