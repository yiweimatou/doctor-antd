import ApiClient from './ApiClient'
import { CATEGORY_API } from '../constants/api'

export function list(params) {
    return ApiClient.get(CATEGORY_API, params)
}

export function get(params) {
    return ApiClient.get(`${CATEGORY_API}/detail`, params)
}

export function detail(params) {
    return ApiClient.get(`${CATEGORY_API}/item`,params)
}