import ApiClient from './ApiClient.js'
import { MONEY_GET_API, MONEY_INFO_API, MONEY_ADD_API, MONEY_LIST_API } from '../constants/api'

export function fetchOne(params) {
  return ApiClient.get(MONEY_GET_API, params)
}

export function fetchList(params) {
  return ApiClient.get(MONEY_LIST_API, params)
}

export function fetchInfo(params) {
  return ApiClient.get(MONEY_INFO_API, params)
}

export function add(params) {
  return ApiClient.put(MONEY_ADD_API, params)
}
