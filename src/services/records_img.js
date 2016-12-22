import ApiClient from './ApiClient'
import { generate } from '../constants/api'

const api = generate('records_img')
const records_img = {
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
        return ApiClient.get(api.info, params)
    },
    add: function(params) {
        return ApiClient.post(api.add, params, { needAuth: true })
    },
    list: function(params) {
        return ApiClient.get(api.list, params)
    }
}

export default records_img