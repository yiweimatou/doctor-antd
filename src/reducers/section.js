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
    ['section/delete/success']:(state,action)=>({
        ...state,
        list:state.list.filter(item=>item.sid!==action.payload.sid)
    }),
    ['section/get']:state=>({
        ...state,
        entity:null
    }),
    ['section/get/success']:(state,action)=>({
        ...state,
        entity:action.payload.entity
    }),
    ['section/new']:state=>({
        ...state,
        loading:true
    }),
    ['secton/new/success']:state=>({
        ...state,
        loading:false
    }),
    ['section/new/failure']:state=>({
        ...state,
        loading:false
    }),
    ['section/edit']:state=>({
        ...state,
        loading:true
    }),
    ['section/edit/success']:(state,action)=>({
        ...state,
        loading:false,
        entity:Object.assign({},state.entity,action.payload.params),
        list:state.list.map(item=>{
            if(item.sid === action.payload.sid){
                return {
                    ...item,
                    ...action.payload
                }
            }else{
                return item
            }
        })
    }),
    ['section/edit/failure']:state=>({
        ...state,
        loading:false
    }),
    ['section/list']:state=>({
        ...state,
        loading:true
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

