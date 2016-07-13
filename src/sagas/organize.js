import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { getOrganizeList,getOrganizeInfo,getOrganize,editOrganize } from '../services/organize.js'
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

function* organizeGetHandler(action){
    try{
        const result = yield call( getOrganize,action.payload)
        yield put({
            type:'organize/get/success',
            payload:{
                entity:result.get
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchOrganizeGet() {
    yield* takeLatest('organize/get',organizeGetHandler)
}

function* editHandler(action){
    try{
        yield call(editOrganize,action.payload)
        yield put({
            type:'organize/edit/success'
        })
        message.success('编辑成功!')
    }catch(error){
        message.error(error)
        yield put({
            type:'orgnanize/edit/failure'
        })
    }
}

function* watchEdit(){
    yield* takeLatest('organize/edit',editHandler)
}

export default function* (){
    yield [ 
        fork( watchOrgnizeList ),
        fork( watchOrganizeInfo ),
        fork( watchOrganizeGet ),
        fork(watchEdit)
    ]
}