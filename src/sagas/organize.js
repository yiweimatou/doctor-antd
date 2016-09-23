import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { getOrganizeList,getOrganizeInfo,getOrganize,editOrganize } from '../services/organize.js'
import { list as get_organize_team_list } from '../services/organizeTeam'
import { push } from 'react-router-redux'

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

function* organizeGetHandler(action){
    try{
        const result = yield call( getOrganize,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve(result.get)
        }
        yield put({
            type:'organize/get/success',
            payload:{
                entity:result.get
            }
        })
    }catch(error){
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
}

function* watchOrganizeGet() {
    yield* takeLatest('organize/get',organizeGetHandler)
}

function* editHandler(action){
    try{
        yield call(editOrganize,action.payload)
        yield put({
            type:'organize/edit/success'
        })
        yield put(push(`/organize/show/${action.payload.id}`))
    }catch(error){
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
