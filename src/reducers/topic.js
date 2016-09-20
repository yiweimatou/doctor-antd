/**
 * Created by zhangruofan on 2016/9/19.
 */
import { handleActions } from 'redux-actions'

const initialState = {
  list: [],
  loading: false,
  total: 0
}

const topic = handleActions({
  ['topic/info']: state => ({
    ...state,
    total: 0
  }),
  ['topic/info/success']: (state, action) => ({
    ...state,
    total: action.payload
  }),
  ['topic/list']: state => ({
    ...state,
    loading: true
  }),
  ['topic/list/success']: (state, action) => ({
    ...state,
    loading: false,
    list: action.payload
  }),
  ['topic/list/failure']: state => ({
    ...state,
    loading: false
  })
}, initialState)

export default topic
