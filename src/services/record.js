import ApiClient from './ApiClient'
import { generate, USER_API_DOMAIN } from '../constants/api'

const api = generate('record')
const record = {
    get: function(params) {
        return ApiClient.get(api.get, params)
    },
    edit: function(params) {
        return ApiClient.post(api.edit, params, { needAuth: true })
    },
    remove: function(params) {
        return ApiClient.post(api.remove, params, { needAuth: true })
    },
    info: function(params) {
        return ApiClient.get(`${USER_API_DOMAIN}/record/info/ext`, params, { needAuth: true })
    },
    add: function(params) {
        return ApiClient.post(api.add, params, { needAuth: true })
    },
    list: function(params) {
        return ApiClient.get(`${USER_API_DOMAIN}/record/list/ext`, params, { needAuth: true })
    }
}

export default record 