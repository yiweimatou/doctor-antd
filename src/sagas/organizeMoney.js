import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import {
    fetchInfo,
    fetchList
} from '../services/organzieMoney'
import {
    message
} from 'antd'

function* watchFetchInfo() {
    yield* takeLatest('organize/money/info', function* (action) {
        try {
            const res = yield call(fetchInfo,action.payload)
            yield put({
                type: 'organize/money/info/success',
                payload: res.count
            })
        } catch (error) {
            message.error(error)
        }
    })
}

function* watchFetchList() {
    yield* takeLatest('organize/money/list', function* (action) {
        try {
            const res = yield call(fetchList, action.payload)
            yield put({
                type: 'organize/money/list/success',
                payload: {
                    list: res.list,
                    params: action.payload
                }
            })
        } catch (error) {
            message.error(error)
            yield put({
                type: 'organize/money/list/failure'
            })
        }
    })
}
export default function* () {
    yield [
        fork(watchFetchInfo),
        fork(watchFetchList)
    ]
}