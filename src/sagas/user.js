import {
    takeLatest
} from 'redux-saga'
import {
    fork, put, call
} from 'redux-saga/effects'
import {
    message
} from 'antd'
import {
    getUserList
} from '../services/user.js'

function* handleUserList(action){
    try {
        const result= yield call(getUserList,action.payload)
        yield put({
            type:'user/list/success',
            payload:{
                list:result.list
            }
        })
    } catch (error) {
        message.error(error)
        yield put({
            type:'user/list/failure'
        })
    }
}

function* watchUserList(){
    yield* takeLatest('user/list',handleUserList)
}

export default function* (){
    yield* [
        fork(watchUserList)
    ]
}