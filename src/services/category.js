import ApiClient from './ApiClient'
import { CATEGORY_API } from '../constants/api'

export function list(params) {
    return ApiClient.get(CATEGORY_API, params)
}