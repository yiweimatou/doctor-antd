import { handleActions } from 'redux-actions'

const initialState = {
    list: [],
    total: 0,
    loading: false
} 

const paper = handleActions({
    ['paper/list']:  state => ({
        ...state,
        list: [],
        loading: true
    }),
    ['paper/list/success']: (state, action) => ({
        ...state,
        list: action.payload,
        loading: false
    }),
    ['paper/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['paper/info/success']: (state, action) => ({
        ...state,
        total: action.payload
    })
}, initialState)

export default paper