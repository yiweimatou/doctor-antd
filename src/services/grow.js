import ApiClient from './ApiClient'
import { 
    GROW_ADD_API
} from '../constants/api'

export function add(params) {
    return ApiClient.post(GROW_ADD_API, params, { needAuth: true })
}