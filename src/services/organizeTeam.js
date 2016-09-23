/**
 * Created by zhangruofan on 2016/9/22.
 */
import ApiClient from './ApiClient'
import {
  ORGANIZE_TEAM_ADD_API,
  ORGANIZE_TEAM_EDIT_API,
  ORGANIZE_TEAM_INFO_API,
  ORGANIZE_TEAM_LIST_API,
  ORGANIZE_TEAM_GET_API
} from '../constants/api'

export function get(params) {
  return ApiClient.get(ORGANIZE_TEAM_GET_API, params)
}

export function edit(params) {
  return ApiClient.put(ORGANIZE_TEAM_EDIT_API, params)
}

export function list(params) {
  return ApiClient.get(ORGANIZE_TEAM_LIST_API, params)
}

export function add(params) {
  return ApiClient.put(ORGANIZE_TEAM_ADD_API, params)
}

export function info(params) {
  return ApiClient.get(ORGANIZE_TEAM_INFO_API, params)
}
