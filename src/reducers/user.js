import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    loading:false
}

const user = handleActions({
    ['user/list']:state=>({
        ...state,
        list:[],
        loading:true
    }),
    ['user/list/success']:(state,action)=>({
        ...state,
        list:action.payload.list,
        loading:false
    }),
    ['user/list/failure']:state=>({
        ...state,
        loading:false
    })
},initialState)

export default user