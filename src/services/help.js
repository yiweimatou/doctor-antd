import ApiClient from './ApiClient'
import {
  generate
} from '../constants/api.js'

const api = generate('help')
const help = {
  get: function (params) {
    return ApiClient.get(api.get, params)
  }
}

export default help