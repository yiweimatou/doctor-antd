import {
    takeLatest
} from 'redux-saga'
import {
    fork,
    put,
    call
} from 'redux-saga/effects'
import {
    login
} from '../services/auth.js'
import {
    getUser
} from '../services/user.js'
import {
    message
} from 'antd'

function* loginHandler(action) {
    try {
        const {
            mobile,
            password
        } = action.payload
        const result = yield call(login, mobile, password)
        const {
            key,
            token
        } = result
        const {
            get
        } = yield call(getUser, {
            uid: key
        })
        const payload = {
            key,
            token,
            user: get,
            lastModifyTime: Date.now()
        }
        yield put({
            type: 'login/success',
            payload
        })
        message.success('登录成功!')
        localStorage.setItem('auth',JSON.stringify(Object.assign(
            {},payload,{
                isAuthed:true,
                loading:false
            })))
    } catch (error) {
        console.log(error)
        message.error(error)
        yield put({
            type: 'login/failure',
            payload: {
                lastModifyTime: Date.now()
            }
        })
    }
}

function* permissionChekcer() {
    
}   

function* watchLogin() {
    yield* takeLatest('login/start', loginHandler)
}

export default function* () {
    yield fork( watchLogin )
}