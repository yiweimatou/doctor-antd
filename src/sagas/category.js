import { takeLatest } from 'redux-saga'
import { fork, call } from 'redux-saga/effects'
import { list } from '../services/category'
import { add } from '../services/grow'


function* watchList() {
    yield takeLatest('category/list', function* (action) {
        try {
            const result = yield call(list, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.list)
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

function* watchGrow() {
    yield takeLatest('grow/add', function* (action) {
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
    yield [
        fork(watchList),
        fork(watchGrow)
    ]
}