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
    getUserList, sendCaptcha, setAlipay
} from '../services/user.js'

function* watchSetAlipay() {
    yield* takeLatest('user/alipay/set', function*(action) {
        try {
            yield call(setAlipay, action.payload)
            yield put({
                type: 'user/alipay/set/success',
                payload: action.payload
            })
            message.success('设置成功!')
        } catch (error) {
            message.error(error)
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
            message.success('验证码发送成功!')
        } catch (error) {
            message.error(error)
            yield put({
                type: 'captcha/send/failure'
            })
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
        fork(watchSendCaptcha)
    ]
}
