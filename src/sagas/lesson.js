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
    newLesson,listLesson,infoLesson,getLesson
} from '../services/lesson.js'
import {
    getLessonTeamList,newLessonTeam,deleteLessonTeam
} from '../services/lessonTeam.js'

function* handleDelete(action) {
    try{
        yield call(deleteLessonTeam,action.payload)
        yield put({
            type:'lessonTeam/delete/success',
            payload:{
                id:action.payload.id
            }
        })
        message.success('操作成功!')
    }catch(error){
        message.error(error)
    }
}

function* watchDelete() {
    yield* takeLatest('lessonTeam/delete',handleDelete)
}

function* handleNewLT(action) {
    try{
        yield call(newLessonTeam,action.payload)
        yield put({
            type:'lessonTeam/new/success'
        })
        message.success('邀请成功!')
    }catch(error){
        message.error(error)
        yield put({
            type:'lessonTeam/new/failure'
        })
    }
}

function* watchNewLT() {
    yield* takeLatest('lessonTeam/new',handleNewLT)
}

function* handleTeamList(action) {
    try{
        const result = yield call(getLessonTeamList,action.payload)
        yield put({
            type:'lessonTeam/list/success',
            payload:{
                list:result.list
            }
        })
    }catch(error){
        message.error(error)
        yield put({
            type:'lessonTeam/list/failure'
        })
    }
}

function* watchTeamList() {
    yield* takeLatest('lessonTeam/list',handleTeamList)
}

function* handlerGet(action){
    try{
        const result = yield call(getLesson,action.payload)
        yield put({
            type:'lesson/get/success',
            payload:{
                entity:result.get
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchGet() {
    yield* takeLatest('lesson/get',handlerGet)
}

function * handleNew(action) {
    try {
        yield call(newLesson, action.payload)
        yield put({
            type: 'lesson/new/success'
        })
        message.success('新增成功!')
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lesson/new/failure'
        })
    }
}

function * watchNew() {
    yield * takeLatest('lesson/new', handleNew)
}

function* handleList(action) {
    try{
        const result = yield call(listLesson,action.payload)
        yield put({
            type:'lesson/list/success',
            payload:{
                data:result.list,
                pageParams:action.payload
            }
        })
    }catch(error){
        message.error(error)
        yield put({
            type:'lesson/list/failure'
        })
    }
}

function* watchList(){
    yield* takeLatest('lesson/list',handleList)
}

function* handleInfo(action){
    try{    
        const result = yield call(infoLesson,action.payload)
        yield put({
            type:'lesson/info/success',
            payload:{
                total:result.count
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchInfo(){
    yield* takeLatest('lesson/info',handleInfo)
}

function* handleTInfo(action){
    try{    
        const result = yield call(infoLesson,action.payload)
        yield put({
            type:'lesson/tinfo/success',
            payload:{
                total:result.count
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchTInfo(){
    yield* takeLatest('lesson/tinfo',handleTInfo)
}

export default function * () {
    yield * [
        fork(watchNew),
        fork(watchList),
        fork(watchInfo),
        fork(watchTInfo),
        fork(watchGet),
        fork(watchTeamList),
        fork(watchNewLT),
        fork(watchDelete)
    ]
}