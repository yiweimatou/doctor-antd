import {
  takeLatest, takeEvery
} from 'redux-saga'
import {
  fork, put, call
} from 'redux-saga/effects'
import {
  getYunbook,
  getYunbookList,
  editYunbook,
  newYunbook,
  getYunbookInfo,
  buy
} from '../services/yunbook.js'
import { push } from 'react-router-redux'
import { info as getBillInfo } from '../services/bill'
import { LESSON, ORGANIZE } from '../constants/api'

function* watchBuy() {
  yield* takeLatest('yunbook/buy', function *(action) {
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
                                  dispose: 3,
                                  order_no: `book.${action.payload.params.id}`
                                })
      //如果没有购买才再购买
      if (result.count === 0) {
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

function* watchFetchYunbookList() {
  yield* takeEvery('yunbook/fetchlist', function* (action){
     try {
        const data = yield call(getYunbookList, action.payload)
        if(action.meta && action.meta.resolve) {
          yield call(action.meta.resolve, data.list)
        }
     } catch (error) {
       if(action.meta && action.meta.reject) {
         yield call(action.meta.reject, error)
       }
     }
  })
}

function* watchFetchYunbookInfo() {
  yield* takeLatest('yunbook/fetchinfo', function* (action){
     try {
        const data = yield call(getYunbookInfo, action.payload)
        if(action.meta && action.meta.resolve) {
          yield call(action.meta.resolve, data.count)
        }
     } catch (error) {
       if(action.meta && action.meta.reject) {
         yield call(action.meta.reject, error)
       }
     }
  })
}


function* watchFetchYunbook () {
   yield * takeLatest('yunbook/fetch', function* (action) {
     try {
       const data = yield call(getYunbook, action.payload)
       if (action.meta && action.meta.resolve) {
         yield call(action.meta.resolve, data.get)
       }
     } catch (error) {
       if (action.meta && action.meta.reject) {
         yield call(action.meta.reject, error)
       }
     }
   })
}

const handleInfo = function* (action) {
  try {
    const result = yield call(getYunbookInfo, action.payload)
    yield put({
      type: 'yunbook/info/success',
      payload:  result.count
    })
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
  }
}

function* watchInfo() {
  yield * takeEvery('yunbook/info', handleInfo)
}

function* handleMyInfo(action) {
  try {
    const result = yield call(getYunbookInfo, action.payload)
    yield put({
      type: 'yunbook/myinfo/success',
      payload: result.count
    })
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
  }
}

function* watchMyInfo() {
  yield * takeEvery('yunbook/myinfo', handleMyInfo)
}

function* handleNew(action) {
  try {
    const res = yield call(newYunbook, action.payload)
    if (action.resolve) {
      action.resolve({
        ...action.payload,
        id: res.identity
      })
    }
    yield put({
      type: 'yunbook/new/success',
      payload: {
        ...action.payload,
        id: res.identity
      }
    })
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
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
    yield put(push(`/yunbook/show?yid=${action.payload.id}`))
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
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
    if (action.reject) {
      action.reject(error)
    }
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
      payload: result.list,
    })
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
    yield put({
      type: 'yunbook/list/failure'
    })
  }
}

function* watchList() {
  yield * takeEvery('yunbook/list', handleList)
}

function* handleMyList(action) {
  try {
    const result = yield call(getYunbookList, action.payload)
    yield put({
      type: 'yunbook/mylist/success',
      payload: result.list
    })
  } catch (error) {
    if (action.reject) {
      action.reject(error)
    }
    yield put({
      type: 'yunbook/mylist/failure'
    })
  }
}

function* watchMyList() {
  yield * takeEvery('yunbook/mylist', handleMyList)
}

export default function*() {
  yield * [
    fork(watchNew),
    fork(watchEdit),
    fork(watchGet),
    fork(watchList),
    fork(watchInfo),
    fork(watchMyList),
    fork(watchMyInfo),
    fork(watchFetchYunbook),
    fork(watchFetchYunbookList),
    fork(watchFetchYunbookInfo),
    fork(watchBuy)
  ]
}
