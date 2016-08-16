import { takeLatest } from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'
import { fetchOne, fetchList, fetchInfo, add } from '../services/money'

function* watchFetchOne() {
  yield* takeLatest('money/fetchone', fetchOneSaga)
}

function* fetchOneSaga(action){
  try {
      const data = yield call(fetchOne, action.payload)
      yield put({
        type: 'money/fetchone/success',
        payload: data.get
      })
  } catch (error) {
    yield put({
      type: 'money/fetchone/failure',
      payload: error
    })
  }
}

function* fetchListSaga(action) {
  try{
    const data = yield call(fetchList, action.payload)
    yield put({
      type: 'money/fetchlist/success',
      payload: {
        data: data.list,
        params: action.payload
      }
    })
  }catch(error) {
    yield put({
      type: 'money/fetchlist/failure',
      payload: error
    })
  }
}

function* watchFetchList() {
  yield* takeLatest('money/fetchlist', fetchListSaga)
}

function* fetchInfoSaga(action) {
  try{
    const data = yield call(fetchInfo, action.payload)
    yield put({
      type: 'money/info/success',
      payload: {
        total: data.count,
        params: action.payload
      }
    })
  }catch(error) {
    yield put({
      type: 'money/info/failure',
      payload: error
    })
  }
}

function* watchFetchInfo() {
  yield* takeLatest('money/info', fetchInfoSaga)
}

function* addSaga(action) {
  try{
    const data = yield call(add, action.payload)
    yield put({
      type: 'money/add/success',
      payload: {
        id: data.identity,
        code_url: data.get.code_url,
        ...action.payload
      }
    })
  }catch(error) {
    yield put({
      type: 'money/add/failure',
      payload: error
    })
  }
}

function* watchAdd() {
  yield* takeLatest('money/add', addSaga)
}

export default function* (){
  yield [
    fork(watchFetchOne),
    fork(watchFetchList),
    fork(watchFetchInfo),
    fork(watchAdd)
  ]
}
