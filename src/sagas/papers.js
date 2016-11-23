import { takeEvery } from 'redux-saga'
import { put, call, fork } from 'redux-saga/effects'
import { list, info } from '../services/papers'

function* watchList() {
    yield takeEvery('papers/list', function* (action) {
        try {
            const result = yield call(list, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.list)
            }
            yield put({
                type: 'papers/list/success',
                payload: result.list
            })
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
            yield put({
                type: 'papers/list/failure'
            })
        }
    })
}

function* watchInfo() {
    yield takeEvery('papers/info', function* (action) {
        try {
            const result = yield call(info, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.count)
            }
            yield put({
                type: 'papers/info/success',
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
        fork(watchInfo)
    ]
}