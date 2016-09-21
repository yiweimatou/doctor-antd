/**
 * Created by zhangruofan on 2016/9/21.
 */
import ApiClient from './ApiClient'
import {
  BILL_ADD_API,
  BILL_GET_API,
  BILL_INFO_API,
  BILL_LIST_API,
  BILL_EDIT_API
} from '../constants/api'

export function get(params) {
  return ApiClient.get(BILL_GET_API, params)
}

export function add(params) {
  return ApiClient.put(BILL_ADD_API, params)
}

export function info(params) {
  return ApiClient.get(BILL_INFO_API, params)
}

export function list(params) {
  return ApiClient.get(BILL_LIST_API, params)
}

export function edit(params) {
  return ApiClient.put(BILL_EDIT_API, params)
}
