/**
 * Created by zhangruofan on 2016/9/17.
 */
import { takeEvery } from 'redux-saga'
import { fork, call, put } from 'redux-saga/effects'
import { add, list, info, remove } from '../services/topic'

function* watchAdd() {
  yield* takeEvery('topic/add', function* (action) {
    try {
      const result = yield call(add, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve({
          ...action.payload.params,
          id: result.identity
        })
      }
      yield put({
        type: 'topic/add/success',
        payload: {
          ...action.payload.params,
          id: result.identity
        }
      })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchList() {
  yield* takeEvery('topic/list', function* (action) {
    try {
      const result = yield call(list, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.list)
      }
      yield put({
        type: 'topic/list/success',
        payload: result.list
      })
    } catch (error) {
      yield put({
        type: 'topic/list/failure'
      })
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchInfo(){
  yield* takeEvery('topic/info', function *(action) {
    try {
      const result = yield call(info, action.payload.params)
      yield put({
        type: 'topic/info/success',
        payload: result.count
      })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchDelete() {
  yield* takeEvery('topic/delete', function* (action) {
    try {
      yield call(remove, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve()
      }
      yield put({
        type: 'topic/delete/success',
        payload: action.payload.params.id
      })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
      yield put({
        type: 'topic/delete/failure'
      })
    }
  })
}

export default function* () {
  yield* [
    fork(watchAdd),
    fork(watchList),
    fork(watchInfo),
    fork(watchDelete)
  ]
}
