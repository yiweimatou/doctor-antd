import {
    handleActions
} from 'redux-actions'

const initialState = {
    list: [],
    mylist: [],
    entity: null,
    total: 0,
    myTotal: 0,
    actionStatus: {
        adding: false,
        editing: false
    },
    loading: false,
    myLoading: false
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
    ['yunbook/edit/success']: (state,action) => ({
        ...state,
        loading: false,
        entity: {
          ...state.entity,
          ...action.payload
        }
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
        loading: false,
        list: action.payload
    }),
    ['yunbook/list/failure']:state=>({
        ...state,
        loading: false
    }),
    ['yunbook/mylist']:state=>({
        ...state,
        myLoading: true
    }),
    ['yunbook/mylist/success']:(state,action)=>({
        ...state,
        myLoading: false,
        mylist: action.payload
    }),
    ['yunbook/mylist/failure']:state=>({
        ...state,
        myLoading: false
    }),
    ['yunbook/info']:state=>({
        ...state,
        total: 0
    }),
    ['yunbook/info/success']:(state,action)=>({
        ...state,
        total: action.payload
    }),
    ['yunbook/myinfo']:state=>({
        ...state,
        myTotal: 0
    }),
    ['yunbook/myinfo/success']:(state,action)=>({
        ...state,
        myTotal: action.payload
    })
}, initialState)

export default yunbook
