/**
 * Created by zhangruofan on 2016/9/17.
 */
import ApicClient from './ApiClient'
import {
  TOPIC_DEL_API,
  TOPIC_GET_API,
  TOPIC_PUT_API,
  TOPIC_ADD_API,
  TOPIC_INFO_API,
  TOPIC_LIST_API,
} from '../constants/api'

export function get(params) {
  return ApicClient.get(TOPIC_GET_API, params)
}

export function info(params) {
  return ApicClient.get(TOPIC_INFO_API, params)
}

export function add(params) {
  return ApicClient.put(TOPIC_ADD_API, params)
}

export function edit(params) {
  return ApicClient.put(TOPIC_PUT_API, params)
}

export function remove(params) {
  return ApicClient.remove(TOPIC_DEL_API, params)
}

export function list(params) {
  return ApicClient.get(TOPIC_LIST_API, params)
}
