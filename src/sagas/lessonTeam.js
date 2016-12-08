/**
 * Created by zhangruofan on 2016/9/20.
 */
import { takeLatest } from 'redux-saga'
import { call, fork } from 'redux-saga/effects'
import {
  get as getLessonTeam,
  getLessonTeamInfo,
  getLessonTeamList,
  newLessonTeam,
  deleteLessonTeam } from '../services/lessonTeam'
import { getUserList } from '../services/user'
import { listLesson } from '../services/lesson'

function* watchAdd() {
  yield takeLatest('lesson_team/add', function *(action) {
    try {
      yield call(newLessonTeam, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve()
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function * watchGet() {
  yield takeLatest('lessonteam/get', function *(action) {
    try {
      const result = yield call(getLessonTeam, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.get)
      }
    } catch(error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchInfo() {
  yield takeLatest('lessonteam/info', function *(action) {
    try {
      const result = yield call(getLessonTeamInfo, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(result.count)
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchList() {
  yield takeLatest('lessonteam/list', function *(action) {
    try {
      const { list } = yield call(getLessonTeamList, action.payload.params)
      /**
       * 1.传lesson_id返回团队成员、
       * 2.传account_id返回对应的课程列表
       */
      if (list && list.length > 0) {
        if (action.payload.params.lesson_id > 0) {
          const users = yield call(getUserList, {
            id_list : list.map(i => i.account_id)
          })
          if (action.payload.resolve) {
            action.payload.resolve(users.list.map(item => {
              const temp = list.find(i => i.account_id === item.id)
              if (temp){
                item.tid = temp.id
                item.role = temp.role
                return item
              }
              return item
            }))
          }
        } else {
          const lessons = yield call(listLesson, {
            id_list: list.map(i => i.lesson_id)
          })
          if (action.payload.resolve) {
            action.payload.resolve(lessons.list)
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

function* watchRemove() {
  yield takeLatest('lesson_team/delete', function *(action) {
    try {
      //如果没有id则先getid再删除
      if (!action.payload.params.id) {
        const result = yield call(getLessonTeam, action.payload.params)
        yield call(deleteLessonTeam, { id: result.get.id })
      } else {
        yield call(deleteLessonTeam, action.payload.params)
      }
      if (action.payload.resolve) {
        action.payload.resolve()
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

export default function *() {
  yield * [
    fork(watchGet),
    fork(watchInfo),
    fork(watchList),
    fork(watchAdd),
    fork(watchRemove)
  ]
}
