import ApiClient from './ApiClient'
import {
    TASK_ADD, TASK_INFO, TASK_LIST, TASK_GET, TASK_SUBMIT, TASK_RECEIVE
} from '../constants/api'

export function get(params) {
    return ApiClient.get(TASK_GET, params)
}

export function info(params) {
    return ApiClient.get(TASK_INFO, params)
}

export function list(params) {
    return ApiClient.get(TASK_LIST, params)
}

export function add(params) {
    return ApiClient.post(TASK_ADD, params, { needAuth: true })
}

export function receive(params) {
    return ApiClient.post(TASK_RECEIVE, params, { needAuth: true })
}

export function submit(params) {
    return ApiClient.post(TASK_SUBMIT, params, { needAuth: true })
}