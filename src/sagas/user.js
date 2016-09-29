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
    getUserList, sendCaptcha, setAlipay, getMoney
} from '../services/user.js'

function* watchGetMoney() {
    yield* takeLatest('user/deposit', function* (action) {
        try {
            yield call(getMoney, action.payload)
            yield put({
                type: 'user/deposit/success'
            })
            yield call(action.meta.resolve)
        } catch (error) {
            yield put({
                type: 'user/deposit/failure'
            })
            yield call(action.meta.reject, error)
        }
    })
}

function* watchSetAlipay() {
    yield* takeLatest('user/alipay/set', function*(action) {
        try {
            yield call(setAlipay, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve()
            }
            yield put({
                type: 'user/alipay/set/success',
                payload: action.payload.params
            })
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
            yield put({
                type: 'user/alipay/set/failure'
            })
        }
    })
}

function* watchSendCaptcha() {
    yield* takeLatest('captcha/send', function* (action) {
        try {
            yield call(sendCaptcha, action.payload)
            yield put({
                type: 'captcha/send/success'
            })
            if (action.meta.resolve) {
                action.meta.resolve()
            }
        } catch (error) {
            yield put({
                type: 'captcha/send/failure'
            })
            if (action.meta.reject) {
                action.meta.reject()
            }
        }
    })
}

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

export default function*() {
    yield * [
        fork(watchUserList),
        fork(watchSetAlipay),
        fork(watchSendCaptcha),
        fork(watchGetMoney)
    ]
}
