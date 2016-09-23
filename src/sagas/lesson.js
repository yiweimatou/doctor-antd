import {
    takeLatest
} from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'
import {
    newLesson,
    listLesson,
    getLesson,
    editLesson,
    putcetLesson,
    rcmdLesson
} from '../services/lesson.js'
import {
    getLessonTeamList
} from '../services/lessonTeam.js'
import {
    push
} from 'react-router-redux'
import {
    getUser
} from '../services/user'

function* putcetLessonHandler(action) {
    try {
        yield call(putcetLesson, action.payload)
        yield put({
            type: 'lesson/put/cet/success',
            payload: action.payload
        })
    } catch (error) {
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
        if (action.meta && action.meta.resolve){
            yield call(action.meta.resolve)
        }
        // yield put(push(`/lesson/show/${res.identity}`))
    } catch (error) {
        yield put({
            type: 'lesson/recommend/failure'
        })
        if (action.meta && action.meta.reject) {
            yield call(action.meta.reject, error)
        }
    }
}

function* watchRecommend() {
    yield takeLatest('lesson/recommend', recommendHandler)
}


function* handlerGet(action) {
    try {
        const result = yield call(getLesson, action.payload)
        if (action.resolve) {
          action.resolve(result.get)
        }
        yield put({
            type: 'lesson/get/success',
            payload: {
                entity: result.get
            }
        })
    } catch (error) {
        if (action.reject) {
          action.reject(error)
        }
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
      const { list } = yield call(getLessonTeamList, action.payload.params)
      /*
       *1.通过lessonteam 获取所有lesson id 分页在这里完成
       * 2.通过ids 获取 lesson list
       */
      if ( list && list.length > 0) {
        const result = yield call(listLesson, {
          id_list: list.map(item => item.lesson_id).join(',')
        })
        if (action.payload.resolve) {
          action.payload.resolve(result.list)
        }
        yield put({ type: 'lesson/list/success', payload: result.list })
      } else {
        if (action.payload.resolve) {
          action.payload.resolve([])
        }
      }
    } catch (error) {
        if (action.payload.reject) {
          action.payload.reject(error)
        }
        yield put({
            type: 'lesson/list/failure'
        })
    }
}

function* watchList() {
    yield * takeLatest('lesson/list', handleList)
}

function* watchUnNormalList() {
  yield* takeLatest('lesson/list/unnormal', function *(action) {
    try {
      const { list } = yield call(getLessonTeamList, action.payload.params)
      if ( list && list.length > 0) {
        const result = yield call(listLesson, {
          id_list: list.map(item => item.lesson_id).join(','),
          state: 2
        })
        if (action.payload.resolve) {
          action.payload.resolve(result.list)
        }
        yield put({ type: 'lesson/list/unnormal/success', payload: result.list })
      } else {
        if (action.payload.resolve) {
          action.payload.resolve([])
        }
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* handleEdit(action) {
    try {
        yield call(editLesson, action.payload)
        yield put({
            type: 'lesson/edit/success',
            payload: action.payload
        })
        yield put(push(`/lesson/show/${action.payload.id}`))
    } catch (error) {
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
        fork(watchGet),
        fork(watchEdit),
        fork(watchRecommend),
        fork(watchputcet),
        fork(watchLessonResidue),
        fork(watchUnNormalList)
    ]
}
