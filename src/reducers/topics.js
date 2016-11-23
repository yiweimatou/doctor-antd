/**
 * Created by zhangruofan on 2016/9/21.
 */
import { handleActions } from 'redux-actions'

const initialState = {
  list: [],
  myList: [],
  loading: false,
  entity: {}
}

const topics = handleActions({
  ['topics/edit']: state => ({
    ...state,
    loading: true
  }),
  ['topics/edit/success']: (state, action) => ({
    ...state,
    loading: false,
    entity: {
      ...state.entity,
      ...action.payload
    }
  }),
  ['topics/edit/failure']: state => ({
    ...state,
    loading: false
  }),
  ['topics/get']: state => ({
    ...state,
    loading: true
  }),
  ['topics/get/success']: (state, action) => ({
    ...state,
    loading: false,
    entity: action.payload
  }),
  ['topic/get/failure']: state => ({
    ...state,
    loading: false
  }),
  ['topics/list']: state => ({
    ...state,
    list: []
  }),
  ['topics/list/success']: (state, action) => ({
    ...state,
    list: action.payload
  }),
  ['topics/mylist']: state => ({
    ...state,
    myList: []
  }),
  ['topics/mylist/success']: (state, action) => ({
    ...state,
    myList: action.payload
  })
}, initialState)

export default topics
