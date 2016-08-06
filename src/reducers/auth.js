import {
    handleActions
} from 'redux-actions'

const initialState = {
    isAuthed: false,
    loading: false,
    key: 0,
    token: '',
    user: null,
    lastModifyTime: 0
}

const auth = handleActions({
    ['user/money/alipay/set/success'](state, action){
        return {
            ...state,
            user: {
                ...state.user,
                alipay: action.payload.alipay
            }
        }
    },
    ['login/success'](state, action) {
        const {
            key,
            token,
            user,
            lastModifyTime
        } = action.payload
        return {
            ...state,
            key,
            token,
            isAuthed: true,
            loading: false,
            user,
            lastModifyTime
        }
    },
    ['login/start'](state) {
        return {
            ...state,
            loading: true
        }
    },
    ['login/failure'](state, action) {
        return {
            ...state,
            loading: false,
            isAuthed:false,
            lastModifyTime: action.payload.lastModifyTime
        }
    },
    ['logout'](){
        return initialState
    }
}, initialState)

export default auth