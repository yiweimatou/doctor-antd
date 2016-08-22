import { takeLatest } from 'redux-saga'
import { fork,put,call } from 'redux-saga/effects'
import { 
    getOrganizeLessonList,
    getOrganizeLessonInfo,
    editOrganizeLesson,
    addOrganizeLesson 
} from '../services/organizeLesson.js'
import { message } from 'antd'
import { getOrganizeList } from '../services/organize'
import { listLesson } from '../services/lesson'
import array from 'lodash/array'

function* organizeLessonListHandler(action) {
    try{
        const result = yield call(getOrganizeLessonList,action.payload)
        if(result.list.length > 0) {
            const [organizes,lessons] = yield [call(getOrganizeList, {
                id_list: array.join(array.uniq(result.list.map(i => i.organize_id)),',')
            })
            ,call(listLesson, {
                id_list: array.join(array.uniq(result.list.map(i=>i.lesson_id)),',')
            })]
            result.list = result.list.map(item => {
                const organize_idx = array.findIndex(organizes.list,{ id: item.organize_id })
                const lesson_idx = array.findIndex(lessons.list,{id: item.lesson_id})
                return {
                    ...item,
                    organize_name: organize_idx === -1 ? '' : organizes.list[organize_idx].title,
                    lesson_name: lesson_idx === -1 ? '' : lessons.list[lesson_idx].title,
                    organize_money: lesson_idx === -1 ? 0 : lessons.list[lesson_idx].organize_money,
                    organize_logo: organize_idx === -1 ? '' : organizes.list[organize_idx].logo
                }
            })
        }
        yield put({ 
            type:'organizeLesson/list/success',
            payload:{
                list:result.list
            }
        })
    }catch(error){
        message.error(error)
        yield put({
            type: 'organizeLesson/list/failure'
        })
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
        yield put({
            type: 'organizeLesson/info/failure'
        })
    }
}

function* watchOrganzieLessonInfo(){
    yield* takeLatest('organizeLesson/info',organizeLessonInfoHandler)
}

function* editOrganizeLessonHandler(action){
    try{
        yield call(editOrganizeLesson,action.payload )
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