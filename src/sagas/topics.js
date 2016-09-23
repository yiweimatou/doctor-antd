/**
 * Created by zhangruofan on 2016/9/17.
 */
import { takeEvery, takeLatest } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { add, list, get, info, buy } from '../services/topics'
import { ORGANIZE, LESSON } from '../constants/api'
import { info as getBillInfo } from '../services/bill'

function* watchAdd() {
  yield takeLatest('topics/add', function *(action){
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

function* watchList() {
  yield takeEvery('topics/list', function *(action) {
    try {
      const result = yield call(list, action.payload.params)
      yield put({
        type: 'topics/list/success',
        payload: result.list
      })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchMyList() {
  yield takeEvery('topics/mylist', function *(action) {
    try {
        const result =yield call(list, action.payload.params)
        yield put({
          type: 'topics/mylist/success',
          payload: result.list
        })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchGet() {
  yield takeEvery('topics/get', function *(action) {
    try {
      const result =  yield call(get, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.get)
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchInfo() {
  yield takeEvery('topics/info', function *(action) {
    try {
      const result =yield call(info, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.count)
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchBuy() {
  yield takeLatest('topics/buy', function *(action) {
    try {
      let foreign_id = 0, category_id = 0
      if (action.payload.params.organize_id > 0) {
        foreign_id = action.payload.params.oid
        category_id = ORGANIZE
      } else if(action.payload.params.lesson_id > 0) {
        foreign_id = action.payload.params.lesson_id
        category_id = LESSON
      }
      const result = yield call(getBillInfo, {
        category_id: category_id,
        foreign_id: foreign_id,
        dispose: '3',
        order_no: `topics.${action.payload.params.id}`
      })
      if (result.count === 0){
        yield call(buy, action.payload.params)
      }
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
    fork(watchAdd),
    fork(watchList),
    fork(watchGet),
    fork(watchInfo),
    fork(watchMyList),
    fork(watchBuy)
  ]
}
