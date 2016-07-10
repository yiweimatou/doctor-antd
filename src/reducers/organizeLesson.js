import { handleActions } from 'redux-actions'

const initialState = {
    limit:6,
    offset:1,
    list:[],
    total:0,
    loading:false
}

const organizeLesson = handleActions({
    ['organizeLesson/list']:(state)=>({
        ...state,
        list:[]
    }),
    ['organizeLesson/list/success']:(state,action)=>({
        ...state,
        limit:action.payload.limit,
        offset:action.payload.offset,
        list:action.payload.list
    }),
    ['organizeLesson/info']:(state)=>({
        ...state,
        total:0
    }),
    ['organizeLesson/info/success']:(state,action)=>({
        ...state,
        total:action.payload.total
    }),
    ['organizeLesson/edit']:(state)=>({
        ...state,
        loading:true
    }),
    ['organizeLesson/edit/success']:(state,action)=>({
        ...state,
        loading:false,
        list:state.list.map(item=>{
            if(item.id === action.payload.id){
                return Object.assign({},item,action.payload)
            }else{
                return item
            }
        })
    }),
    ['organizeLesson/edit/failure']:(state)=>({
        ...state,
        loading:false
    }),
    ['organizeLesson/new']:(state)=>({
        ...state,
        loading:true
    }),
    ['organizeLesson/add/success']:(state)=>({
        ...state,
        loading:false
    }),
    ['organizeLesson/add/failure']:state=>({
        ...state,
        loading:false
    })

},initialState)

export default organizeLesson