import { takeLatest } from 'redux-saga'
import { fork, call } from 'redux-saga/effects'
import {
    getOrganizeLessonInfo,
    editOrganizeLesson,
    addOrganizeLesson,
    getOrganizeLessonList,
    // getOrganizeLesson
} from '../services/organizeLesson.js'
import { getOrganizeList } from '../services/organize'
import { listLesson } from '../services/lesson'

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

export default function* () {
    yield [
        fork( watchOrganzieLessonInfo ),
        fork( watchOrganzieLessonEdit ),
        fork(watchNew),
        fork(watchList),
        // fork(watchGet)
    ]
}
