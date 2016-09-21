/**
 * Created by zhangruofan on 2016/9/20.
 */
import { takeLatest } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { get } from '../services/lessonTeam'

function * watchGet() {
  yield takeLatest('lessonTeam/get', function *(action) {
    try {
      const result = yield call(get, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.get.role)
      }
    } catch(error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

export default function *() {
  yield * [
    fork(watchGet)
  ]
}
