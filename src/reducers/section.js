import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    limit:6,
    offset:1,
    total:0,
    entity:null,
    loading:false
}

const section = handleActions({
    ['section/add']: state => ({
      ...state,
      loading: true
    }),
    ['section/add/success']: state => ({
      ...state,
      loading: false
    }),
    ['section/add/failure']: state => ({
      ...state,
      loading: false
    }),
    ['section/delete/success']: (state, action) => ({
        ...state,
        list:state.list.filter(item=>item.sid!==action.payload.sid)
    }),
    ['section/get']:state=>({
        ...state,
        entity: null
    }),
    ['section/get/success']: (state, action) => ({
        ...state,
        entity: action.payload
    }),
    ['section/edit']: state => ({
        ...state,
        loading: true
    }),
    ['section/edit/success']: (state, action) => ({
        ...state,
        loading: false,
        entity: {
          ...state.entity,
          ...action.payload
        }
    }),
    ['section/edit/failure']: state => ({
        ...state,
        loading: false
    }),
    ['section/list']: state => ({
        ...state,
        loading: true
    }),
    ['section/list/success']:(state,action)=>({
        ...state,
        loading:false,
        list:action.payload.list
    }),
    ['section/list/failure']:state=>({
        ...state,
        loading:false
    }),
    ['section/info']:state=>({
        ...state,
        total:0
    }),
    ['section/info/success']:(state,action)=>({
        ...state,
        total:action.payload.total
    })
},initialState)

export default section

