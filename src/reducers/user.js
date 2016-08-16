import { handleActions } from 'redux-actions'

const initialState = {
    list:[],
    loading:false,
    captcha: {
        loading: false,
        isSuccess: false
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
