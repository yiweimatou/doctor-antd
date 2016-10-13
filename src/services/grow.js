import ApiClient from './ApiClient'
import { 
    GROW_ADD_API, GROW_GET_API, GROW_EDIT_API
} from '../constants/api'

export function add(params) {
    return ApiClient.post(GROW_ADD_API, params, { needAuth: true })
}

export function get(params) {
    return ApiClient.get(GROW_GET_API, params)
}

export function edit(params) {
    return ApiClient.post(GROW_EDIT_API, params, { needAuth: true })
}