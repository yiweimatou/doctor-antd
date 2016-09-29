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
  ['topic/delete']: state => ({
    ...state,
    loading: true
  }),
  ['topic/delete/success']: (state, action) => ({
    ...state,
    loading: false,
    list: state.list.filter(i => i.id !== action.payload)
  }),
  ['topic/delete/failure']: state => ({
    ...state,
    loading: false
  }),
  ['topic/add/success']: (state, action) => ({
    ...state,
    list: [action.payload].concat(state.list),
    total: state.total + 1
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
