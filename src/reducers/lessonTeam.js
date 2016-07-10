import { handleActions } from 'redux-actions'

const initialState ={
    list:[],
    limit:6,
    offset:1,
    loading:false,
    total:0
}

const lessonTeam = handleActions({
    ['lessonTeam/list']:state=>({
        ...state,
        loading:true,
        list:[]
    }),
    ['lessonTeam/list/success']:(state,action)=>({
        ...state,
        loading:false,
        list:action.payload.list
    }),
    ['lessonTeam/list/failure']:state=>({
        ...state,
        loading:false
    }),
    ['lessonTeam/new']:state=>({
        ...state,
        loading:true
    }),
    ['lessonTeam/new/success']:state=>({
        ...state,
        loading:false
    }),
    ['lessonTeam/new/failure']:state=>({
        ...state,
        loading:false
    }),
    ['lessonTeam/delete/success']:(state,action)=>({
        ...state,
        list:state.list.filter(item=>item.id!==action.payload.id)
    })
},initialState)

export default lessonTeam