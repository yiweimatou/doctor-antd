import { takeEvery } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { list, info, get } from '../services/paper'

function* watchGet() {
    yield takeEvery('paper/get', function* (action) {
        try {
            const result = yield call(get, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.get)
            }
            yield put({
                type: 'paper/get/success',
                payload: result.get
            })
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
            yield put({
                type: 'paper/get/failure'
            })
        }
    })
}

function* watchList() {
    yield takeEvery('paper/list', function* (action) {
        try {
            const result = yield call(list, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.list)
            }
            yield put({
                type: 'paper/list/success',
                payload: result.list
            })
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
            yield put({
                type: 'paper/list/failure'
            })
        }
    })
}

function* watchInfo() {
    yield takeEvery('paper/info', function* (action) {
        try {
            const result = yield call(info, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.count)
            }
            yield put({
                type: 'paper/info/success',
                payload: result.count
            })
        } catch (error) {
            if (action.payload.reject){
                action.payload.reject(error)
            }
        }
    })
}

export default function* () {
    yield * [
        fork(watchList),
        fork(watchInfo),
        // fork(watchGet)
    ]
}