import ApiClient from './ApiClient'
import {
    ORGANIZE_LINK_ADD, ORGANIZE_LINK_EDIT, ORGANIZE_LINK_REMOVE, ORGANIZE_LINK_INFO, ORGANIZE_LINK_LIST, ORGANIZE_LINK_GET
} from '../constants/api.js'

export function get(params) {
    return ApiClient.get(ORGANIZE_LINK_GET, params)
}

export function info(params) {
    return ApiClient.get(ORGANIZE_LINK_INFO, params)
}

export function list(params) {
    return ApiClient.get(ORGANIZE_LINK_LIST, params)
}

export function add(params) {
    return ApiClient.post(ORGANIZE_LINK_ADD, params, { needAuth: true })
}

export function edit(params) {
    return ApiClient.post(ORGANIZE_LINK_EDIT, params, { needAuth: true })
}

export function remove(params) {
    return ApiClient.post(ORGANIZE_LINK_REMOVE, params, { needAuth: true })
}