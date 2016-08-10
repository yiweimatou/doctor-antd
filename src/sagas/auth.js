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

function* watchSetUser() {
    yield* takeLatest('user/set', function*(action) {
        try {
            const user = yield call(getUser, action.payload)
            yield put({
                type: 'user/set/success',
                payload: user.get
            })
        } catch (error) {
            console.error(error)
        }
    })
}

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
            id: key
        })
        const payload = {
            key,
            token,
            user: get
        }
        yield put({
            type: 'login/success',
            payload
        })
        message.success('登录成功!')
        localStorage.setItem('auth', JSON.stringify(Object.assign({}, payload, {
            isAuthed: true,
            loading: false
        })))
    } catch (error) {
        message.error(error)
        yield put({
            type: 'login/failure'
        })
    }
}


function* watchLogout() {
    yield* takeLatest('logout',()=>{
        localStorage.clear()
        window.location.reload()
    })
}

const watchLogin = function* () {
    yield* takeLatest('login/start', loginHandler)
}

const authSaga = function*() {
    yield [
      fork(watchLogin),
      fork(watchLogout),
      fork(watchSetUser)
    ]
}

export default authSaga
