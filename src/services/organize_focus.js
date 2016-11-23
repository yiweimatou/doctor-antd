import ApiClient from './ApiClient'
import { ORGANIZE_FOCUS_INFO, ORGANIZE_FOCUS_LIST } from '../constants/api'

export function info(params) {
  return ApiClient.get(ORGANIZE_FOCUS_INFO, params)
}

export function list(params) {
  return ApiClient.get(ORGANIZE_FOCUS_LIST, params)
}
