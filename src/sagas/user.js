import {
    takeLatest
} from 'redux-saga'
import {
    fork,
    put,
    call
} from 'redux-saga/effects'
import {
    message
} from 'antd'
import {
    getUserList, fetchUserMoneyInfo, fetchUserMoneyList
} from '../services/user.js'

function* handleUserList(action) {
    try {
        const result = yield call(getUserList, action.payload)
        yield put({
            type: 'user/list/success',
            payload: {
                list: result.list
            }
        })
    } catch (error) {
        message.error(error)
        yield put({
            type: 'user/list/failure'
        })
    }
}

function* watchUserList() {
    yield * takeLatest('user/list', handleUserList)
}

function* watchFetchUserMoneyInfo(){
    yield* takeLatest('user/money/info', function* (action){
        try {
            const res = yield call(fetchUserMoneyInfo, action.payload)
            yield put({
                type: 'user/money/info/success',
                payload: res.count
            })
        } catch (error) {
            message.error(error)
        }
    })
}

function* watchFetchUserMoneyList() {
    yield* takeLatest('user/money/list', function* (action) {
        try {
            const res = yield call(fetchUserMoneyList, action.payload)
            yield put({
                type: 'user/money/list/success',
                payload: {
                    list: res.list,
                    params: action.payload
                }
            })
        } catch (error) {
            yield put({
                type: 'user/money/list/failure'
            })
            message.error(error)            
        }
    })
}

export default function*() {
    yield * [
        fork(watchUserList),
        fork(watchFetchUserMoneyInfo),
        fork(watchFetchUserMoneyList)
    ]
}