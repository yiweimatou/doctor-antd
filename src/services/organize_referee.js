import ApiClient from './ApiClient'
import {
  generate
} from '../constants/api.js'

const api = generate('organize_referee')
const organize_referee = {
  get: function (params) {
    return ApiClient.get(api.get, params)
  },
  list: function (params) {
    return ApiClient.get(api.list, params)
  },
  add: function (params) {
    return ApiClient.post(api.add, params, { needAuth: true })
  },
  delete: function (params) {
    return ApiClient.post(api.remove, params, { needAuth: true })
  },
  edit: function (params) {
    return ApiClient.post(api.edit, params, { needAuth: true })
  },
  info: function (params) {
    return ApiClient.get(api.info,  params)
  }
}

export default organize_referee