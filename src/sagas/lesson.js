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
    newLesson,
    listLesson,
    infoLesson,
    getLesson,
    editLesson,
    putcetLesson,
    fetchLessonMoneyInfo,
    fetchLessonMoneyList,
    rcmdLesson
} from '../services/lesson.js'
import {
    getLessonTeamList,
    newLessonTeam,
    deleteLessonTeam,
    editLessonTeam
} from '../services/lessonTeam.js'
import {
    push
} from 'react-router-redux'
import array from 'lodash/array'
import {
    getUserList, getUser
} from '../services/user'

function* watchFetchLessonMoneyList(){
    yield* takeLatest('lesson/money/list', function* (action) {
        try {
            const res = yield call(fetchLessonMoneyList, action.payload)
            yield put({
                type: 'lesson/money/list/success',
                payload: {
                    list: res.list,
                    params: action.payload
                }
            })
        } catch (error) {
            message.error(error)
            yield put({
                type: 'lesson/money/list/failure'
            })   
        }  
    })
}

function* watchFetchlessonMoneyInfo() {
    yield* takeLatest('lesson/money/info', function* (action){
        try {
            const res = yield call(fetchLessonMoneyInfo, action.payload)
            yield put({
                type: 'lesson/money/info/success',
                payload: res.count
            })
        } catch (error) {
            message.error(error)
        }
    })
}

function* putcetLessonHandler(action) {
    try {
        yield call(putcetLesson, action.payload)
        yield put({
            type: 'lesson/put/cet/success',
            payload: action.payload
        })
        message.success('操作成功')
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lesson/put/cet/failure'
        })
    }
}

function* watchputcet() {
    yield takeLatest('lesson/put/cet', putcetLessonHandler)
}

function* recommendHandler(action) {
    try {
        yield call(rcmdLesson, action.payload)
        yield put({
            type: 'lesson/recommend/success'
        })
        message.success('推荐成功！')
        // yield put(push(`/lesson/show/${res.identity}`))
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lesson/recommend/failure'
        })
    }
}

function* watchRecommend() {
    yield takeLatest('lesson/recommend', recommendHandler)
}

function* handleTeamEdit(action) {
    try {
        yield call(editLessonTeam, action.payload)
        message.success('操作成功!')
        yield put({
            type: 'lessonTeam/edit/success',
            payload: action.payload
        })
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lessonTeam/edit/failure',
            payload: error
        })
    }
}

function* watchTeamEdit() {
    yield takeLatest('lessonTeam/edit', handleTeamEdit)
}

function* handleDelete(action) {
    try {
        yield call(deleteLessonTeam, action.payload)
        yield put({
            type: 'lessonTeam/delete/success',
            payload: {
                id: action.payload.id
            }
        })
        message.success('操作成功!')
    } catch (error) {
        message.error(error)
    }
}

function* watchDelete() {
    yield * takeLatest('lessonTeam/delete', handleDelete)
}

function* handleNewLT(action) {
    try {
        yield call(newLessonTeam, action.payload)
        yield put({
            type: 'lessonTeam/new/success'
        })
        message.success('邀请成功!')
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lessonTeam/new/failure'
        })
    }
}

function* watchNewLT() {
    yield * takeLatest('lessonTeam/new', handleNewLT)
}

function* handleTeamList(action) {
    try {
        const result = yield call(getLessonTeamList, action.payload)
        if(result.list.length > 0) {
            const lesson_id_list = array.uniq(result.list.map(item => item.lesson_id))
            const account_id_list = array.uniq(result.list.map(item => item.account_id))
            const [lessons, users] = yield [call(listLesson, {
                id_list: lesson_id_list
            }), call(getUserList, {
                id_list: account_id_list
            })]
            result.list = result.list.map(item => {
                    const lesson_idx = array.findIndex(lessons.list, {
                        id: item.lesson_id
                    })
                    const user_idx = array.findIndex(users.list, {
                        id: item.account_id
                    })
                    return {
                        ...item,
                        lesson: lesson_idx === -1 ? '' : lessons.list[lesson_idx],
                        user: user_idx === -1 ? [] : users.list[user_idx]
                    }
                })
        }
        yield put({
            type: 'lessonTeam/list/success',
            payload: {
                list: result.list
            }
        })
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lessonTeam/list/failure'
        })
    }
}

function* watchTeamList() {
    yield * takeLatest('lessonTeam/list', handleTeamList)
}

function* handlerGet(action) {
    try {
        const result = yield call(getLesson, action.payload)
        yield put({
            type: 'lesson/get/success',
            payload: {
                entity: result.get
            }
        })
    } catch (error) {
        message.error(error)
    }
}

function* watchGet() {
    yield * takeLatest('lesson/get', handlerGet)
}

function* handleNew(action) {
    try {
        const res = yield call(newLesson, action.payload)
        yield put({
            type: 'lesson/new/success'
        })
        if(action.meta && action.meta.resolve){
            action.meta.resolve(res.identity)
        }
    } catch (error) {
        if(action.meta && action.meta.reject) {
            action.meta.reject(error)
        }
        yield put({
            type: 'lesson/new/failure'
        })
    }
}

function* watchNew() {
    yield * takeLatest('lesson/new', handleNew)
}

function* handleList(action) {
    try {
        const result = yield call(listLesson, action.payload)
        const account_ids = result.list.map(item => {
            if(item.rcmd_account_id){
                return item.account_id
            }
        })
        const rcmd_account_ids = result.list.map(item => {
            if(item.rcmd_account_id){
                return item.rcmd_account_id
            }
        })
        const ids = array.join(array.uniq(account_ids.concat(rcmd_account_ids)),',')
        const users = yield call(getUserList,{ id_list: ids})
        yield put({
            type: 'lesson/list/success',
            payload: {
                data: result.list,
                otherInfos:{
                    users:array.zipObject(users.list.map(i=>i.id),users.list)
                }
            }
        })
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lesson/list/failure'
        })
    }
}

function* watchList() {
    yield * takeLatest('lesson/list', handleList)
}

function* handleInfo(action) {
    try {
        const result = yield call(infoLesson, action.payload)
        yield put({
            type: 'lesson/info/success',
            payload: {
                total: result.count
            }
        })
    } catch (error) {
        message.error(error)
    }
}

function* watchInfo() {
    yield * takeLatest('lesson/info', handleInfo)
}

function* handleTInfo(action) {
    try {
        const result = yield call(infoLesson, action.payload)
        yield put({
            type: 'lesson/tinfo/success',
            payload: {
                total: result.count
            }
        })
    } catch (error) {
        message.error(error)
    }
}

function* watchTInfo() {
    yield * takeLatest('lesson/tinfo', handleTInfo)
}

function* handleEdit(action) {
    try {
        yield call(editLesson, action.payload)
        yield put({
            type: 'lesson/edit/success',
            payload: action.payload
        })
        message.success('编辑成功!')
        yield put(push(`/lesson/show/${action.payload.id}`))
    } catch (error) {
        message.error(error)
        yield put({
            type: 'lesson/edit/failure'
        })
    }
}

function* watchEdit() {
    yield * takeLatest('lesson/edit', handleEdit)
}

function* watchLessonResidue() {
    yield* takeLatest('lesson/residue', function* (action) {
        try {
            const data = yield call(getUser, action.payload)
            if(action.meta && action.meta.resolve) {
                action.meta.resolve(data.get.lesson_num)
            }
        } catch (error) {
            if(action.meta && action.meta.reject) {
                action.meta.reject(error)
            }
        }
    })
}

export default function*() {
    yield * [
        fork(watchNew),
        fork(watchList),
        fork(watchInfo),
        fork(watchTInfo),
        fork(watchGet),
        fork(watchTeamList),
        fork(watchNewLT),
        fork(watchDelete),
        fork(watchEdit),
        fork(watchRecommend),
        fork(watchputcet),
        fork(watchTeamEdit),
        fork(watchFetchlessonMoneyInfo),
        fork(watchFetchLessonMoneyList),
        fork(watchLessonResidue)
    ]
}