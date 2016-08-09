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
    getUserList, fetchUserMoneyInfo, fetchUserMoneyList, sendCaptcha, setAlipay
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
        fork(watchFetchUserMoneyList),
        fork(watchSetAlipay),
        fork(watchSendCaptcha)
    ]
}