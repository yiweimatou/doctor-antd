import { handleActions } from 'redux-actions'

const initialState = {
    list:{
        data:[],
        params:{
            limit: 6,
            offset: 1
        },
        total:0,
    },
    loading:false
}

const organizeLesson = handleActions({
    ['organizeLesson/list']:(state,action)=>({
        list:{
            ...state.list,
            params: action.payload,
            data: []
        },
        loading: true
    }),
    ['organizeLesson/list/success']:(state,action)=>({
        list: {
            ...state.list,
            data: action.payload.list
        },
        loading : false
    }),
    ['organizeLesson/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['organizeLesson/info']:(state)=>({
        ...state,
        list: {
            ...state.list,
            total: 0
        }
    }),
    ['organizeLesson/info/success']:(state,action)=>({
        ...state,
        list: {
            ...state.list,
            total: action.payload.total
        }
    }),
    ['organizeLesson/edit']:(state)=>({
        ...state,
        loading:true
    }),
    ['organizeLesson/edit/success']:(state,action)=>({
        ...state,
        loading:false,
        list:{
            ...state.list,
            data: state.list.data.map(item=>{
                if(item.id === action.payload.id){
                    return Object.assign({},item,action.payload)
                }else{
                    return item
                }
            })
        }
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