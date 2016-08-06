import {
  takeLatest
}
from 'redux-saga'
import {
  fork, put, call
}
from 'redux-saga/effects'
import {
  message
}
from 'antd'
import {
  getYunbook,
  getYunbookList,
  editYunbook,
  newYunbook,
  getYunbookInfo
}
from '../services/yunbook.js'
import { push } from 'react-router-redux'

const handleInfo = function* (action) {
  try {
    const result = yield call(getYunbookInfo, action.payload)
    yield put({
      type: 'yunbook/info/success',
      payload: {
        total: result.count
      }
    })
  } catch (error) {
    message.error(error)
  }
}

function* watchInfo() {
  yield * takeLatest('yunbook/info', handleInfo)
}

function* handleMyInfo(action) {
  try {
    const result = yield call(getYunbookInfo, action.payload)
    yield put({
      type: 'yunbook/myinfo/success',
      payload: {
        total: result.count
      }
    })
  } catch (error) {
    message.error(error)
  }
}

function* watchMyInfo() {
  yield * takeLatest('yunbook/myinfo', handleMyInfo)
}

function* handleNew(action) {
  try {
    const res = yield call(newYunbook, action.payload)
    yield put({
      type: 'yunbook/new/success'
    })
    message.success('新建成功!')
    yield put(push('/yunbook/show/' + res.identity))
  } catch (error) {
    message.error(error)
    yield put({
      type: 'yunbook/new/failure'
    })
  }
}

function* watchNew() {
  yield * takeLatest('yunbook/new', handleNew)
}

function* handleEdit(action) {
  try {
    yield call(editYunbook, action.payload)
    yield put({
      type: 'yunbook/edit/success',
      payload: action.payload
    })
    yield put(push(`/yunbook/show/${action.payload.id}`))
    message.success('编辑成功!')    
  } catch (error) {
    message.error(error)
    yield put({
      type: 'yunbook/edit/failure'
    })
  }
}

function* watchEdit() {
  yield * takeLatest('yunbook/edit', handleEdit)
}

function* handleGet(action) {
  try {
    const result = yield call(getYunbook, action.payload)
    yield put({
      type: 'yunbook/get/success',
      payload: {
        entity: result.get
      }
    })
  } catch (error) {
    message.error(error)
  }
}

function* watchGet() {
  yield * takeLatest('yunbook/get', handleGet)
}

function* handleList(action) {
  try {
    const result = yield call(getYunbookList, action.payload)
    yield put({
      type: 'yunbook/list/success',
      payload: {
        list: result.list,
        params: action.payload
      }
    })
  } catch (error) {
    message.error(error)
    yield put({
      type: 'yunbook/list/failure'
    })
  }
}

function* watchList() {
  yield * takeLatest('yunbook/list', handleList)
}

function* handleMyList(action) {
  try {
    const result = yield call(getYunbookList, action.payload)
    yield put({
      type: 'yunbook/mylist/success',
      payload: {
        list: result.list,
        params: action.payload
      }
    })
  } catch (error) {
    message.error(error)
    yield put({
      type: 'yunbook/mylist/failure'
    })
  }
}

function* watchMyList() {
  yield * takeLatest('yunbook/mylist', handleMyList)
}

export default function*() {
  yield * [
    fork(watchNew),
    fork(watchEdit),
    fork(watchGet),
    fork(watchList),
    fork(watchInfo),
    fork(watchMyList),
    fork(watchMyInfo)
  ]
}
