import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    loading:false,
    captcha: {
        loading: false,
        isSuccess: false
    },
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
    ['captcha/send']: state => ({
        ...state,
        captcha: {
            loading: true,
            isSuccess: false
        }
    }),
    ['captcha/send/success']: state => ({
        ...state,
        captcha: {
            loading: false,
            isSuccess: true
        }
    }),
    ['captcha/send/failure']: state => ({
        ...state,
        captcha: {
            loading: false,
            isSuccess: false
        }
    }),
    ['user/alipay/set']: state => ({
        ...state,
        loading: true
    }),
    ['user/alipay/set/success']: (state) => ({
        ...state,
        loading: false
    }),
    ['user/alipay/set/failure']: state => ({
        ...state,
        loading: false
    }),
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