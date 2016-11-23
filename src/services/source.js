import ApiClient from './ApiClient'
import {
    SOURCE_Add_API, SOURCE_EDIT_API, SOURCE_INFO_API, SOURCE_GET_API, SOURCE_DELETE_API, SOURCE_LIST_API
} from '../constants/api'

export function get(params) {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return ApiClient.get(SOURCE_GET_API, {...params, account_id: auth.key})
}

export function add(params) {
    return ApiClient.post(SOURCE_Add_API, params, {needAuth: true})
}

export function edit(params) {
    return ApiClient.put(SOURCE_EDIT_API, params)
}

export function remove(params) {
    return ApiClient.remove(SOURCE_DELETE_API, params)
}

export function info(params) {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return ApiClient.get(SOURCE_INFO_API, {...params, account_id: auth.key})
}

export function list(params) {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return ApiClient.get(SOURCE_LIST_API, {...params, account_id: auth.key})
}