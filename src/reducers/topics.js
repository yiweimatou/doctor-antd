/**
 * Created by zhangruofan on 2016/9/21.
 */
import { handleActions } from 'redux-actions'

const initialState = {
  list: [],
  myList: [],
  loading: false
}

const topics = handleActions({
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
