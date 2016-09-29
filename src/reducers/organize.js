import { handleActions } from 'redux-actions'

const initialState = {
    list: [],
    loading: false,
    total: 0,
    entity: null
}

const organize = handleActions({
    ['organzie/edit']:state=>({
        ...state,
        isSuccess: false
    }),
    ['organize/edit/success']:state=>({
        ...state,
        loading:false
    }),
    ['organize/edit/failure']:state=>({
        ...state,
        loading: false
    }),
    ['organize/list']: state => ({
        ...state,
        loading: true,
        list: []
    }),
    ['organize/list/success']: (state,action) => ({
        ...state,
        loading: false,
        list: action.payload
    }),
    ['organize/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['organize_team/info']: state => ({
      ...state,
      total: 0
    }),
    ['organize_team/info/success']: (state, action) => ({
        ...state,
        total: action.payload
    }),
    ['organize/get']:(state)=>({
        ...state,
        entity: null
    }),
    ['organize/get/success']: (state, action) => ({
        ...state,
        entity: action.payload.entity
    })
},initialState)

export default organize
