import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { 
    getOrganizeLessonList,
    getOrganizeLessonInfo,
    editOrganizeLesson,
    addOrganizeLesson 
} from '../services/organizeLesson.js'
import { message } from 'antd'

function* organizeLessonListHandler(action) {
    try{
        const result = yield call( getOrganizeLessonList,action.payload )
        yield put({
            type:'organizeLesson/list/success',
            payload:{
                list:result.list,
                ...action.payload
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchOrganzieLessonList(){
    yield* takeLatest('organizeLesson/list',organizeLessonListHandler)
}

function* organizeLessonInfoHandler(action){
    try{
        const result = yield call( getOrganizeLessonInfo,action.payload )
        yield put({
            type:'organizeLesson/info/success',
            payload:{
                total:result.count
            }
        })
    }catch(error){
        message.error(error)
    }
}

function* watchOrganzieLessonInfo(){
    yield* takeLatest('organizeLesson/info',organizeLessonInfoHandler)
}

function* editOrganizeLessonHandler(action){
    try{
        yield call( editOrganizeLesson,action.payload )
        yield put({
            type:'organizeLesson/edit/success',
            payload:action.payload
        })
        message.success('操作成功!')
    }catch(error){
        message.error(error)
        yield put({
            type:'organizeLesson/edit/failure'
        })
    }
}

function* watchOrganzieLessonEdit(){
    yield* takeLatest('organizeLesson/edit',editOrganizeLessonHandler)
}

function* newHandler(action){
    try{
        yield call(addOrganizeLesson,action.payload)
        yield put({
            type:'organizeLesson/new/success'
        })
        message.success('操作成功!')
    }catch(error){
        message.error(error)
        yield put({
            type:'organizeLesson/new/failure'
        })
    }
}

function* watchNew(){
    yield* takeLatest('organizeLesson/new',newHandler)
}

export default function* () {
    yield [
        fork( watchOrganzieLessonList ),
        fork( watchOrganzieLessonInfo ),
        fork( watchOrganzieLessonEdit ),
        fork(watchNew)
    ]
}