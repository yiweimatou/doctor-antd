import { handleActions } from 'redux-actions'

const initialState ={
    list:[],
    params:{
        limit:6,
        offset:1,
    },
    loading:false,
    total:0
}

const lessonTeam = handleActions({
    ['lessonTeam/edit']: state => ({
        ...state,
        loading: true
    }),
    ['lessonTeam/edit/success']: (state, action) => ({
        ...state,
        loading: false,
        list: state.list.filter(item => item.id !== action.payload.id)
    }),
    ['lessonTeam/edit/failure']: state => ({
        ...state,
        loading: false
    }),
    ['lessonTeam/list']:(state, action) =>({
        ...state,
        loading:true,
        list:[],
        params: action.payload
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