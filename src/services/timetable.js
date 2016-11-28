import ApiClient from './ApiClient'
import {
    TIME_TABLE_ADD,
    TIME_TABLE_GET,
    TIME_TABLE_EDIT
} from '../constants/api'

export function get(params: Object) {
    return ApiClient.get(TIME_TABLE_GET, params)
}

export function edit(params: Object) {
    return ApiClient.post(TIME_TABLE_EDIT, params, { needAuth: true })
}

export function add(params: Object) {
    return ApiClient.post(TIME_TABLE_ADD, params, { needAuth: true })
}