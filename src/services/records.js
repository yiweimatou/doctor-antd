import ApiClient from './ApiClient'
import { generate } from '../constants/api'
import records_img from './records_img'
import records_item from './records_item'

const api = generate('records')
const records = {
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
    },
    listAsync: async function(params, callback) {
        const data = await this.list(params)
        if (data.list.length > 0) {
            let result = []
            result = await Promise.all(data.list.map(async function(item) {
                const imgs = await records_img.list({
                    limit: 100,
                    offset: 1,
                    records_id: item.id
                })
                const items = await records_item.list({
                    limit: 100,
                    offset: 1,
                    records_id: item.id
                })
                return {
                    ...item,
                    imgs: imgs.list || [],
                    items: items.list || []
                }     
            }))
            callback(null, result)
        } else {
            callback(null, [])
        }
    }
}

export default records