import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { message } from 'antd'
import {
    getSection,
    editSection,
    getSectionList,
    newSection,
    getSectionInfo,
    deleteSection
} from '../services/section'
// import { push } from 'react-router-redux'

const handleDelete = function* (action){
    try{
        yield call(deleteSection,action.payload)
        yield put({
            type:'section/delete/success',
            payload:action.payload
        })
        message.success('删除成功!')
    }catch(error){
        message.error(error)
    }
}

function* watchDelete(){
    yield* takeLatest('section/delete',handleDelete)
}

function* handleNew(action) {
    try {
        const result = yield call(newSection, action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve(result.identity)
        }
        yield put({
          type: 'section/add/success'
        })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
      yield put({
        type : 'section/add/failure'
      })
    }
}

function* watchNew() {
    yield* takeLatest('section/add',handleNew)
}

function* handleEdit(action) {
    try {
        yield call(editSection,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve()
        }
        yield put({
            type: 'section/edit/success',
            payload: action.payload.params
        })
    } catch (error) {
        if (action.payload.reject) {
          action.payload.reject(error)
        }
        yield put({
            type:'section/edit/failure'
        })
    }
}

function* watchEdit() {
    yield* takeLatest('section/edit',handleEdit)
}

function* handleList(action) {
    try {
        const data = yield call(getSectionList,action.payload)
        yield put({
            type:'section/list/success',
            payload:{
                list:data.list
            }
        })
    } catch (error) {
        message.error(error)
        yield put({
            type:'section/list/failure'
        })
    }
}

function* watchList() {
    yield* takeLatest('section/list',handleList)
}

function* handleGet(action) {
    try {
        const data = yield call(getSection,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve(data.get)
        }
        yield put({
            type: 'section/get/success',
            payload: data.get
        })
    } catch (error) {
        message.error(error)
    }
}

function* watchGet() {
    yield* takeLatest('section/get',handleGet)
}

function* handleInfo(action) {
    try {
        const data = yield call(getSectionInfo,action.payload)
        yield put({
            type:'section/info/success',
            payload:{
                total:data.count
            }
        })
    } catch (error) {
        message.error(error)
    }
}

function* watchInfo() {
    yield* takeLatest('section/info',handleInfo)
}

export default function*() {
    yield* [
        fork(watchEdit),
        fork(watchGet),
        fork(watchList),
        fork(watchNew),
        fork(watchInfo),
        fork(watchDelete)
    ]
}
