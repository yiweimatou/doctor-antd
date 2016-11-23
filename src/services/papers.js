import ApiClient from './ApiClient'
import { PAPERS_LIST_API, PAPERS_INFO_API } from '../constants/api'

export const list = params => {
    return ApiClient.get(PAPERS_LIST_API, params)
}

export const info = params => {
    return ApiClient.get(PAPERS_INFO_API, params)
}