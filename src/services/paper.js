import ApiClient from './ApiClient'
import { PAPER_LIST_API, PAPER_INFO_API, PAPER_GET_API } from '../constants/api'
import { getUserList } from './user'

export const list = params => {
    return ApiClient.get(PAPER_LIST_API, params)
}

export const info = params => {
    return ApiClient.get(PAPER_INFO_API, params)
}

export const get = params => {
    return ApiClient.get(PAPER_GET_API, params)
}

export async function listAsync(params) {
    const data = await ApiClient.get(PAPER_LIST_API, params)
    const users = await getUserList({ id_list: data.list.map(v => v.account_id) })
    return data.list.map(item => {
        const user = users.list.find(i => i.id === item.account_id)
        if (user) {
            return {
                ...item,
                id_code: user.id_code,
                name: user.cet_name || user.cname
            }
        }
        return item
    })
}
