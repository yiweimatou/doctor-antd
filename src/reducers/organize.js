import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    limit:9,
    offset:1,
    loading:false,
    total:0
}

const organize = handleActions({
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
    })
},initialState)

export default organize