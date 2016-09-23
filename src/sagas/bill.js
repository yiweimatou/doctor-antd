/**
 * Created by zhangruofan on 2016/9/22.
 */
import { takeEvery } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { info, list } from '../services/bill'

function* watchInfo() {
  yield takeEvery('bill/info', function *(action) {
    try {
      const result = yield call(info, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.count)
      }
      yield put({ type: 'bill/info/success', payload: result.count })
    }
     catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchList() {
  yield takeEvery('bill/list', function *(action) {
    try {
      const result = yield call(list, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.list)
      }
      yield put({
        type: 'bill/list/success',
        payload: result.list
      })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
      yield put({ type: 'bill/list/failure'})
    }
  })
}

export default function* () {
  yield [
    fork(watchInfo),
    fork(watchList)
  ]
}
