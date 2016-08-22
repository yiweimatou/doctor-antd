import ApiClient from '../services/ApiClient'
import {
    MSG_INFO_API, MSG_LIST_API
} from '../constants/api'

export function fetchList(params) {
  return ApiClient.get(MSG_LIST_API, params)
}

export function fetchInfo(params) {
  return ApiClient.get(MSG_INFO_API, params)
}
