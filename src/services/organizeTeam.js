/**
 * Created by zhangruofan on 2016/9/22.
 */
import ApiClient from './ApiClient'
import { getUserList } from './user'
import {
  ORGANIZE_TEAM_ADD_API,
  ORGANIZE_TEAM_EDIT_API,
  ORGANIZE_TEAM_INFO_API,
  ORGANIZE_TEAM_LIST_API,
  ORGANIZE_TEAM_GET_API,
  ORGANIZE_TEAM_DEL,
  DEFAULT_FACE
} from '../constants/api'

export function get(params) {
  return ApiClient.get(ORGANIZE_TEAM_GET_API, params)
}

export function edit(params) {
  return ApiClient.put(ORGANIZE_TEAM_EDIT_API, params, { needAuth: true })
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

export function remove(params) {
  return ApiClient.post(ORGANIZE_TEAM_DEL, params, { needAuth: true })
}

export async function asyncList(params, callback) {
  try {
    let data = []
    const teams = await list(params)
    if (teams.list && teams.list.length > 0) {
      const users = await getUserList({ id_list: teams.list.map(i => i.account_id).join(',') })
      if (users.list && users.list.length > 0) {
        data = teams.list.map(item => {
          const user =  users.list.find(i => i.id === item.account_id)
          if (user) {
            item.user = `${user.cet_cname}/${user.cname}`
            item.logo = user.cover || DEFAULT_FACE
            item.mobile = user.mobile
          }
          return item
        })
      }
    }
    callback(null, data)
  } catch (error) {
    callback(error, [])
  }
}
