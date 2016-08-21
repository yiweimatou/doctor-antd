import { 
    handleActions
} from 'redux-actions'

const initialState = {
    list:{
        data:[],
        offset:1,
        limit:6,
        total:0
    },
    mylist:{
        data:[],
        offset:1,
        limit:6,
        total:0
    },
    entity:null,
    actionStatus: {
        adding: false,
        editing: false
    },
    loading:false
}

const yunbook = handleActions({
    ['yunbook/get']:state=>({
        ...state,
        entity:null
    }),
    ['yunbook/get/success']:(state,action)=>({
        ...state,
        entity:action.payload.entity
    }),
    ['yunbook/edit']:state=>({
        ...state,
        loading:true
    }),
    ['yunbook/edit/success']:(state,action)=>({
        ...state,
        loading:false,
        entity:Object.assign({},state.entity,action.payload)
    }),
    ['yunbook/edit/failure']:state=>({
        ...state,
        loading:false
    }),
    ['yunbook/new']:state=>({
        ...state,
        actionStatus: {
            ...state.actionStatus,
            adding: true
        }
    }),
    ['yunbook/new/success']:(state)=>({
        ...state,
        actionStatus: {
            ...state.actionStatus,
            adding: false
        }
    }),
    ['yunbook/new/failure']:state=>({
        ...state,
        actionStatus: {
            ...state.actionStatus,
            adding: false
        }
    }),
    ['yunbook/list']:state=>({
        ...state,
        loading:true
    }),
    ['yunbook/list/success']:(state,action)=>({
        ...state,
        loading:false,
        list:{
            total:state.list.total,
            data:action.payload.list,
            ...action.payload.params
        }
    }),
    ['yunbook/list/failure']:state=>({
        ...state,
        loading:false
    }),
    ['yunbook/mylist']:state=>({
        ...state,
        loading:true
    }),
    ['yunbook/mylist/success']:(state,action)=>({
        ...state,
        loading:false,
        mylist:{
            total:state.mylist.total,
            data:action.payload.list,
            ...action.payload.params
        }
    }),
    ['yunbook/mylist/failure']:state=>({
        ...state,
        loading:false
    }),
    ['yunbook/info']:state=>({
        ...state,
        list:{
            ...state.list,
            total:0
        }
    }),
    ['yunbook/info/success']:(state,action)=>({
        ...state,
        list:{
            ...state.list,
            total:action.payload.total
        }
    }),
    ['yunbook/myinfo']:state=>({
        ...state,
        mylist:{
            ...state.mylist,
            total:0
        }
    }),
    ['yunbook/myinfo/success']:(state,action)=>({
        ...state,
        mylist:{
            ...state.mylist,
            total:action.payload.total
        }
    })
},initialState)

export default yunbook