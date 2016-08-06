import ApiClient from './ApiClient.js'
import {
    TEAM_LIST_API,
    TEAM_INFO_API,
    TEAM_ADD_API,
    TEAM_REMOVE_API,
    TEAM_EDIT_API
} from '../constants/api.js'

export function getLessonTeamList(params){
    return ApiClient.get(TEAM_LIST_API,params)
}

export function getLessonTeamInfo(params){
    return ApiClient.get(TEAM_INFO_API,params)
}

export function newLessonTeam(params){
    return ApiClient.post(TEAM_ADD_API,params,{needAuth:true})
}

export function deleteLessonTeam(params) {
    return ApiClient.remove(TEAM_REMOVE_API,params)
}

export function editLessonTeam(params) {
    return ApiClient.put(TEAM_EDIT_API,params)
}