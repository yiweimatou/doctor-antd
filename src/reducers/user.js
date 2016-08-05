import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    loading:false,
    money: {
        loading: false,
        data: [],
        params: {
            limit: 6,
            offset: 1
        },
        total: 0
    }
}

const user = handleActions({
    ['user/money/info/success']: (state, action) => ({
        ...state,
        money: {
            ...state.money,
            total: action.payload
        }
    }),
    ['user/money/list/success']: (state, action) => ({
        ...state,
        money: {
            ...state.money,
            data: action.payload.list,
            params: action.payload.params,
            loading: false
        }
    }),
    ['user/money/list']: state => ({
        ...state,
        money: {
            ...state.money,
            loading: true
        }
    }),
    ['user/money/list/failure']: state => ({
        ...state,
        money: {
            ...state.money,
            loading: false
        }
    }),
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