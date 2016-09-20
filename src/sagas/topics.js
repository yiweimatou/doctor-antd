/**
 * Created by zhangruofan on 2016/9/17.
 */
import { takeEvery } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { add } from '../services/topics'

function* watchAdd() {
  yield takeEvery('topics/add', function *(action){
    try {
      yield call(add, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve()
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

export default function* () {
  yield *[
    fork(watchAdd)
  ]
}
