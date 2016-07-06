import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { getOrganizeList,getOrganizeInfo } from '../services/organize.js'
import { message } from 'antd'

function* organizeListHandler(action){
    try{
        const result = yield call( getOrganizeList,action.payload)
        yield put({
                type:'organize/list/success',
                payload:{
                    list:result.list,
                    ...action.payload
                }
            })
    }catch(error){
        message.error(error)
        yield put({
                    type:'organize/list/failure'
                })
    }
}

function* watchOrgnizeList(){
    yield* takeLatest('organize/list',organizeListHandler)
}

function* organizeInfoHandler(action){
    try{
        const result = yield call(getOrganizeInfo,action.payload)
        yield put({
            type:'organize/info/success',
            payload:{
                total:result.count
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchOrganizeInfo(){
    yield* takeLatest('organize/info',organizeInfoHandler)
}

export default function* (){
    yield [ 
        fork( watchOrgnizeList ),
        fork( watchOrganizeInfo )
    ]
}