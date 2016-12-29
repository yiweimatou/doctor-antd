import ApiClient from './ApiClient'
import { generate } from '../constants/api'
import records_category from './records_category'

const api = generate('records_item')
const records_item = {
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
    listAsync: async function(params) {
        const result = await this.list(params)
        console.log(result.list)
        const categorys = await records_category.list({
            id_list: result.list.map(i => i.item_id).join(',')
        })
        return result.list.map(item => {
            const category = categorys.list.find(i => i.id === item.item_id)
            if (category) return {
                ...item,
                title: category.title
            }
            return item
        })
    }
}

export default records_item
