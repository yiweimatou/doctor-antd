/**
 * Created by zhangruofan on 2016/9/22.
 */
import { handleActions } from 'redux-actions'
const initialState = {
  list: [],
  loading: false,
  total: 0
}

const bill = handleActions({
  ['bill/info']: state => ({
    ...state,
    total: 0
  }),
  ['bill/info/success']: (state, action) => ({
    ...state,
    total: action.payload
  }),
  ['bill/list']: state => ({
    ...state,
    list: [],
    loading: true
  }),
  ['bill/list/success']: (state, action) => ({
    ...state,
    loading: false,
    list: action.payload
  }),
  ['bill/list/failure']: state => ({
    ...state,
    loading: false
  })
}, initialState)

export default bill
