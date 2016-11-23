import ApiClient from './ApiClient'
import { PAPER_LIST_API, PAPER_INFO_API, PAPER_GET_API } from '../constants/api'

export const list = params => {
    return ApiClient.get(PAPER_LIST_API, params)
}

export const info = params => {
    return ApiClient.get(PAPER_INFO_API, params)
}

export const get = params => {
    return ApiClient.get(PAPER_GET_API, params)
}