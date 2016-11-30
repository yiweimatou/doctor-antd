import ApiClient from './ApiClient'
import { HTML_GET } from '../constants/api'

export function get(url) {
    return ApiClient.get(HTML_GET, { url })
}