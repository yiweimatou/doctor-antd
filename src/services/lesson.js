import ApiClient from './ApiClient.js'
import {
    LESSON_ADD_API,
    LESSON_GET_API,
    LESSON_REMOVE_API,
    LESSON_EDIT_API,
    LESSON_LIST_API,
    LESSON_INFO_API,
    LESSON_PUT_CET_API,
    LESSON_RCMD_API
} from '../constants/api.js'
import { getUserList } from './user'
import array from 'lodash/array'
import { getLessonTeamList, getLessonTeamInfo } from './lessonTeam'

export function newLesson(params){
    return ApiClient.post(LESSON_ADD_API,params,{needAuth:true})
}

export function getLesson(params){
    return ApiClient.get( LESSON_GET_API,params )
}

export function deleteLesson(params){
    return ApiClient.delete( LESSON_REMOVE_API,params )
}

export function editLesson(params){
    return ApiClient.put( LESSON_EDIT_API,params )
}

export function listLesson(params){
    return ApiClient.get( LESSON_LIST_API,params)
}

export function infoLesson(params){
    return ApiClient.get(LESSON_INFO_API,params)
}

export function putcetLesson(params){
    return ApiClient.put(LESSON_PUT_CET_API,params)
}

export function rcmdLesson(params) {
    return ApiClient.put(LESSON_RCMD_API, params)
}

export async function asyncInfo(params, callback) {
    try {
        const { cname, cet_cname, mobile } = params
        let count = 0
        if (cname || cet_cname || mobile) {
            const users =await getUserList({ cname, cet_cname, mobile, offset: 1, limit: 100 })
            if (users.list && users.list.length > 0) {
                const teams = await getLessonTeamInfo({
                    account_id_list: users.list.map(i => i.id).join(','),
                    role: 1, state: 1
                })
                count = teams.count
            }
        } else {
            const data = await infoLesson(params)
            count = data.count
        }
        callback(null, count)
    } catch (error) {
        callback(error, 0)
    }
}

export async function asyncList(params, callback) {
    try {
        let res = []
        const { cname, cet_cname, mobile } = params
        if (cname || cet_cname || mobile) {
            const users =await getUserList({ cname, cet_cname, mobile, offset: 1, limit: 100 })
            if (users.list && users.list.length > 0) {
                const teams = await getLessonTeamList({
                    account_id_list: users.list.map(i => i.id),
                    role: 1, state: 1
                })
                if (teams.list && teams.list.length > 0) {
                    const lessons = await listLesson({
                        id_list: teams.list.map(i => i.lesson_id).join(','),
                        state: 1
                    })
                    if (lessons.list && lessons.list.length > 0) {
                        res = lessons.list.map(item => {
                            const team = teams.list.find(i => i.lesson_id === item.id)
                            if (team) {
                                const user = users.list.find(i => i.id === team.account_id)
                                if (user) {
                                    item.admin = `${user.cet_cname}/${user.cname}/${user.mobile}`
                                }
                            }
                            return item
                        })
                    }
                }
            }
        } else {
            const result = await listLesson(params)
            res = result.list
            if (res && res.length > 0) {
                const teams = await getLessonTeamList({
                    lesson_id_list: array.uniq(res.map(i => i.id)).join(','),
                    role: 1
                })
                if (teams.list && teams.list.length > 0) {
                    res = res.map(item => {
                        const team = teams.list.find(i => i.lesson_id === item.id)
                        if (team) {
                            item.adminId = team.account_id
                        }
                        return item
                    })
                    const users = await getUserList({
                        id_list: array.uniq(teams.list.map(i => i.account_id)).join(',')
                    })
                    if (users.list && users.list.length > 0) {
                        res = res.map(item => {
                            const user = users.list.find(i => i.id === item.adminId)
                            if (user) {
                                item.admin = `${user.cet_cname}/${user.cname}/${user.mobile}`
                            }
                            return item
                        })
                    }
                }
            }
        }
        callback(null, res)
    } catch (error) {
        callback(error, [])
    }
}