import { takeLatest } from 'redux-saga'
import { fork,put,call, select } from 'redux-saga/effects'
import { getOrganizeList,getOrganizeInfo,getOrganize,editOrganize } from '../services/organize.js'
import { list as get_organize_team_list } from '../services/organizeTeam'
import { info as getFansInfo } from '../services/organize_focus'
import { getOrganizeLessonInfo } from '../services/organizeLesson'
import { getUser } from '../services/user'

function* watchMyList() {
  yield takeLatest('organize/mylist', function *(action) {
    try {
      const { list } = yield call(get_organize_team_list, action.payload.params)
      if (list && list.length > 0) {
        const result = yield call(getOrganizeList, {
          id_list: list.map(item => item.organize_id).join(','),
          state: 1
        })
        if (action.payload.resolve) {
          action.payload.resolve(result.list)
        }
      } else {
        if (action.payload.resolve) {
          action.payload.resolve([])
        }
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}
function* organizeListHandler(action){
    try{
        const result = yield call(getOrganizeList, action.payload.params)
        yield put({
                type:'organize/list/success',
                payload: result.list
            })
    }catch(error){
        if (action.payload.reject) {
          action.payload.reject(error)
        }
        yield put({
                    type:'organize/list/failure'
                })
    }
}

function* watchOrgnizeList() {
    yield* takeLatest('organize/list',organizeListHandler)
}

function* organizeInfoHandler(action){
    try{
        const result = yield call(getOrganizeInfo,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve(result.count)
        }
        yield put({
            type: 'organize/info/success',
            payload: result.count
        })
    } catch(error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
}

function* watchOrganizeInfo(){
    yield* takeLatest('organize/info',organizeInfoHandler)
}

function* organizeProcess(organize) {
  const { count }= yield call(getFansInfo, { organize_id: organize.id })
  const res = yield call(getOrganizeLessonInfo, { organize_id: organize.id, state: 1 })
  organize.fans = count
  organize.lessons = res.count
  const result = yield call(get_organize_team_list, { role: 1, state: 1, organize_id: organize.id })
  if (result.list.length > 0) {
    const data = yield call(getUser, { id: result.list[0].account_id })
    if (data.get.id > 0) {
      organize.admin = data.get.cet_cname || data.get.cname
    }
  }
  return organize
}

function* organizeGetHandler(action){
    try{
      const { entity, list } = yield select(state => state.organize)
      let organize = {}
      if (entity.id && entity.id.toString() === action.payload.params.id.toString()) {
        organize = entity
      } else if(list.length > 0 && list.some(i => i.id === action.payload.params.id)) {
        organize = list.find(i => i.id === action.payload.params.id)
        organize = yield organizeProcess(organize)
      } else {
        const result = yield call(getOrganize, action.payload.params)
        if (result.get.id > 0) {
          organize = yield organizeProcess(result.get)
        }
      }
      if (action.payload.resolve) {
        action.payload.resolve(organize)
      }
      yield put({
          type:'organize/get/success',
          payload:{
              entity: organize
          }
      })
    }catch(error){
      if (action.payload.reject) {
        action.payload.reject(error)
      }
      yield put({
        type: 'organize/get/failre'
      })
    }
}

function* watchOrganizeGet() {
    yield* takeLatest('organize/get',organizeGetHandler)
}

function* editHandler(action){
    try{
        yield call(editOrganize,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve()
        }
        yield put({
            type:'organize/edit/success',
            payload: action.payload.params
        })
    }catch(error){
      if (action.payload.reject) {
        action.payload.reject(error)
      }
      yield put({
          type:'orgnanize/edit/failure'
      })
    }
}

function* watchEdit(){
    yield* takeLatest('organize/edit',editHandler)
}

export default function* (){
    yield [
        fork( watchOrgnizeList ),
        fork( watchOrganizeInfo ),
        fork( watchOrganizeGet ),
        fork(watchEdit),
        fork(watchMyList)
    ]
}
