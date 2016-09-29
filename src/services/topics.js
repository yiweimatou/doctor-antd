/**
 * Created by zhangruofan on 2016/9/17.
 */
import ApiClient from './ApiClient'
import {
  TOPICS_GET_API,
  TOPICS_ADD_API,
  TOPICS_PUT_API,
  TOPICS_BUY_API,
  TOPICS_INFO_API,
  TOPICS_LIST_API,
  TOPICS_DEL_API
} from '../constants/api'

export function get(params) {
  return ApiClient.get(TOPICS_GET_API, params)
}

export function info(params) {
  return ApiClient.get(TOPICS_INFO_API, params)
}

export function list(params) {
  return ApiClient.get(TOPICS_LIST_API, params)
}

export function add(params) {
  return ApiClient.put(TOPICS_ADD_API, params)
}

export function remove(params) {
  return ApiClient.remove(TOPICS_DEL_API, params)
}

export function edit(params) {
  return ApiClient.put(TOPICS_PUT_API, params)
}

export function buy(params) {
  return ApiClient.put(TOPICS_BUY_API, params)
}
