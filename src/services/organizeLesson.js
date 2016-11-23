import ApiClient from './ApiClient.js'
import array from 'lodash/array'
import {
    ORGANIZELESSON_ADD_API,
    ORGANIZELESSON_EDIT_API,
    ORGANIZELESSON_INFO_API,
    ORGANIZELESSON_LIST_API,
    ORGANIZELESSON_GET_API,
    ORGANIZE_BUY
} from '../constants/api.js'
import { getUserList } from './user'
import { listLesson, infoLesson } from './lesson'
import { getLessonTeamList } from './lessonTeam'

export function getOrganizeLesson(params) {
    return ApiClient.get(ORGANIZELESSON_GET_API, params)
}

export function getOrganizeLessonList(params){
    return ApiClient.get(ORGANIZELESSON_LIST_API, params)
}

export function addOrganizeLesson(params){
    return ApiClient.post( ORGANIZELESSON_ADD_API,params,{needAuth:true} )
}

export function editOrganizeLesson(params){
    return ApiClient.put( ORGANIZELESSON_EDIT_API,params)
}

export function getOrganizeLessonInfo(params){
    return ApiClient.get( ORGANIZELESSON_INFO_API,params )
}

export function buy(params) {
    return ApiClient.post(ORGANIZE_BUY, params, { needAuth: true })
}

export async function asyncInfo(params, callback) {
    try {
        const { organize_id, state, cname, cet_cname, mobile, title } = params
        let count = 0
        if (cet_cname || cname || mobile) {
            const users = await getUserList({ cet_cname, cname, mobile, offset: 1, limit: 100 })
            if (users.list && users.list.length > 0) {
                const teams = await getLessonTeamList({ offset: 1, limit: 10000, state: 1, role: 1, account_id_list: users.list.map(i => i.id).join(',') })
                if (teams.list && teams.list.length > 0) {
                    if (title) {
                        const lessons = await listLesson({
                            title,
                            id_list: teams.list.map(i => i.lesson_id).join(','),
                            offset: 1,
                            limit: 10000
                        })
                        if (lessons.list && lessons.list.length > 0) {
                             const info = await getOrganizeLessonInfo({
                                organize_id, state, lesson_id_list: lessons.list.map(i => i.lesson_id).join(',')
                            })
                            count = info.count
                        }
                    } else {
                        const info = await getOrganizeLessonInfo({
                            organize_id, state, lesson_id_list: teams.list.map(i => i.lesson_id).join(',')
                        })
                        count = info.count
                    }           
                }
            }
        } else {
                const data = await getOrganizeLessonList({ organize_id, state, offset: 1, limit: 10000 })
                if (title) {
                    const result = await infoLesson({ title, id_list: data.list.map(i => i.lesson_id).join(',') })
                    count = result.count
                } else {
                    count = data.list.count
                }
        }
        callback(null, count)
    } catch (error) {
        callback(error, 0)
    }
}

export async function list(params, callback) {
    try {
        const { cname, cet_cname, mobile, title, ...rest } = params
        let res = []        
        if (cname || cet_cname || mobile) {
            const users = await getUserList({ cet_cname, cname, mobile, offset: 1, limit: 100 })
            if (users.list && users.list.length > 0) {
                const teams = await getLessonTeamList({ offset: 1, limit: 10000, state: 1, role: 1, account_id_list: users.list.map(i => i.id).join(',') })
                if (teams.list && teams.list.length > 0) {
                    const data = await getOrganizeLessonList({
                        ...rest, lesson_id_list: teams.list.map(i => i.lesson_id).join(',')
                    })
                    if (data.list && data.list.length > 0) {
                        const lessons = await listLesson({
                            lesson_id_list: data.list.map(i => i.lesson_id).join(','),
                            title
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
            }
        } else {
            const lessons = await getOrganizeLessonList({ ...rest, limit: 10000 })
            const lessonIds = lessons.list.map(i => i.lesson_id).join(',')
            const lessonList = await listLesson({
                title,
                id_list: lessonIds,
                offset: rest.offset,
                limit: rest.limit
            })
            const teams = await getLessonTeamList({
                lesson_id_list: lessonIds,
                role: 1,
                state: 1
            })
            if (teams && teams.list.length > 0) {
                res = lessonList.list.map(item => {
                    const team = teams.list.find(i => i.lesson_id === item.id)
                    const organizeLesson = lessons.list.find(i => i.lesson_id === item.id)
                    if (team) {
                        item.adminId = team.account_id
                    }
                    if (organizeLesson) {
                        item.start_ms = organizeLesson.start_ms
                        item.expires_ms = organizeLesson.expires_ms
                        item.buy_state = organizeLesson.state
                        item.ol_id = organizeLesson.id
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
                            return item
                        }
                        return item
                    })
                }
            }
        }
        callback(null, res)
    } catch(error) {
        callback(error, [])
    }
}