import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    limit:6,
    offset:1,
    loading:false,
    total:0,
    entity:null
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
        loading:false
    }),
    ['organize/list']:(state)=>({
        ...state,
        loading:true
    }),
    ['organize/list/success']:(state,action)=>({
        ...state,
        loading:false,
        limit:action.payload.limit,
        offset:action.payload.offset,
        list:action.payload.list
    }),
    ['organize/list/failure']:(state)=>({
        ...state,
        loading:false
    }),
    ['organize/info']:(state)=>({
        ...state,
        total:0
    }),
    ['organize/info/success']:(state,action)=>({
        ...state,
        total:action.payload.total
    }),
    ['organize/get']:(state)=>({
        ...state,
        entity:null
    }),
    ['organize/get/success']:(state,action)=>({
        ...state,
        entity:action.payload.entity
    })
},initialState)

export default organize