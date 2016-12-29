import ApiClient from './ApiClient'
import { generate } from '../constants/api'
import records_img from './records_img'
import records_item from './records_item'
import records_category from './records_category'

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
        try {
            const data = await this.list(params)
            if (data.list.length > 0) {
                let result = []
                result = await Promise.all(data.list.map(async function(item) {
                    const imgs = await records_img.list({
                        limit: 100,
                        offset: 1,
                        records_id: item.id,
                        state: 1
                    })
                    let items = await records_item.list({
                        limit: 100,
                        offset: 1,
                        records_id: item.id,
                        state: 1
                    })
                    const categorys = await records_category.list({
                        id_list: items.list.map(i => i.item_id).join(',')
                    })
                    items = items.list.map(item => {
                        const category = categorys.list.find(cg => cg.id === item.item_id)
                        if (category) {
                            return {
                                ...item,
                                title: category.title
                            }
                        }
                        return item
                    })
                    return {
                        ...item,
                        imgs: imgs.list || [],
                        items: items || []
                    }
                }))
                callback(null, result)
            } else {
                callback(null, [])
            }
        } catch(error) {
            callback(error)
        }
    }
}

export default records
