/**
 * Created by zhangruofan on 2016/9/22.
 */
import { takeLatest } from 'redux-saga'
import { call, fork, put } from 'redux-saga/effects'
import { add, list as getList, info, get as getOrganizeTeam } from '../services/organizeTeam'
import { getUserList } from '../services/user'
import { getOrganizeList } from '../services/organize'

function* watchGet() {
  yield takeLatest('organize_team/get', function *(action) {
    try {
      const { get } = yield call(getOrganizeTeam, action.payload.params)
      if (action.payload.resolve) {
        action.payload.resolve(get)
      }
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchAdd() {
  yield takeLatest('organize_team/add', function *(action) {
    try {
      yield call(add, action.payload.params)
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

function* watchInfo() {
  yield takeLatest('organize_team/info', function *(action){
    try {
      const { count } = yield call(info, action.payload.params)
      yield put({ type: 'organize_team/info/success', payload: count })
    } catch (error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

function* watchList() {
  yield takeLatest('organize_team/list', function *(action) {
    try {
      if (!action.payload.resolve) return
      const { list } = yield call(getList, action.payload.params)
      if (list && list.length > 0) {
        if (action.payload.params.account_id > 0) {
          const result = yield call(getOrganizeList, {
            id_list: list.map(i => i.organize_id).join(','),
            //state: 1 //当机构冻结时每页的数量会少于limit
          })
          action.payload.resolve(result.list)
        } else {
          const result = yield call(getUserList, {
            id_list: list.map(i => i.account_id).join(',')
          })
          action.payload.resolve(result.list)
        }
      }else {
          action.payload.resolve([])
      }
    } catch(error) {
      if (action.payload.reject) {
        action.payload.reject(error)
      }
    }
  })
}

export default function* () {
  yield [
    fork(watchAdd),
    fork(watchList),
    fork(watchInfo),
    fork(watchGet)
  ]
}
