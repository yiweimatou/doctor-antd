import { takeLatest } from 'redux-saga'
import { fork, call, put } from 'redux-saga/effects'
import array from 'lodash/array'
import {
    getOrganizeLessonInfo,
    editOrganizeLesson,
    addOrganizeLesson,
    getOrganizeLessonList,
    // getOrganizeLesson
} from '../services/organizeLesson.js'
import { getOrganizeList } from '../services/organize'
import { listLesson } from '../services/lesson'
import { getLessonTeamList } from '../services/lessonTeam'
import { getUserList } from '../services/user'

function* watchList() {
  yield takeLatest('organize_lesson/list', function *(action) {
    try {
      const { list } = yield call(getOrganizeLessonList, action.payload.params)
      if (list && list.length > 0) {
        if (action.payload.params.lesson_id > 0) {
          const result = yield call(getOrganizeList, {
            id_list: list.map(i => i.organize_id).join(','),
            state: 1
          })
          if (action.payload.resolve) {
            action.payload.resolve(result.list)
          }
        } else {
          const result = yield call(listLesson, {
            id_list: list.map(i => i.lesson_id).join(','),
            state: 1
          })
          if (action.payload.resolve) {
            action.payload.resolve(result.list)
          }
        }
        
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

function* organizeLessonInfoHandler(action){
    try{
        const result = yield call(getOrganizeLessonInfo,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve(result.count)
        }
    }catch(error){
        if (action.payload.reject) {
          action.payload.reject(error)
        }
    }
}

function* watchOrganzieLessonInfo(){
    yield* takeLatest('organize_lesson/info',organizeLessonInfoHandler)
}

function* editOrganizeLessonHandler(action){
    try {
        yield call(editOrganizeLesson,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve()
        }
    } catch(error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
}

function* watchOrganzieLessonEdit(){
    yield* takeLatest('organize_lesson/edit',editOrganizeLessonHandler)
}

function* newHandler(action){
    try {
        yield call(addOrganizeLesson,action.payload.params)
        if (action.payload.resolve) {
          action.payload.resolve()
        }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
}

function* watchNew(){
    yield* takeLatest('organize_lesson/add',newHandler)
}

// function* watchGet() {
//   yield takeLatest('organize_lesson/get', function *(action) {
//     try {
//       const { get } = yield call(getOrganizeLesson, action.payload.params)
//       if (action.payload.resolve) {
//         action.payload.resolve(get)
//       }
//     } catch (error) {
//       if (action.payload.reject) {
//         action.payload.reject(error)
//       }
//     }
//   })
// }

function* watchOrganizeLessonList() {
  yield* takeLatest('organize/lesson/list', function*(action) {
    try {
      const result = yield  call(getOrganizeLessonList, action.payload.params)
      let payload = []
      if (result.list && result.length > 0) {
        const lessons = yield call(listLesson, { 
          id_list: result.list.map(i => i.lesson_id).join(','),
          state: action.payload.params.lesson_state || 0
        })
        if (lessons.list && lessons.list.length > 0) {       
          const teams = yield call(getLessonTeamList, {
            lesson_id_list: lessons.list.map(i => i.id).join(','),
            role: 1
          })
          if (teams.list && teams.list.length > 0) {
            const users = yield call(getUserList, { id_list: array.uniq(teams.list.map(i => i.account_id).join(',')) })
            payload = lessons.list.map(item => {
              const user = users.list.find(u => u.id === item.account_id)
              if (user) {
                item.admin = `${user.cname}/${user.mobile}`
                return item
              }
              return item
            })
          } else {
            payload = lessons.list
          }
        }
      }
      yield put({
        type: 'organize/lesson/list/success',
        payload
      })
    } catch(error) {
      yield put({
        type: 'organize/lesson/list/failure'
      })
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}
export default function* () {
    yield [
        fork( watchOrganzieLessonInfo ),
        fork( watchOrganzieLessonEdit ),
        fork(watchNew),
        fork(watchList),
        fork(watchOrganizeLessonList)
        // fork(watchGet)
    ]
}
