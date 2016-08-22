import {
    handleActions
} from 'redux-actions'

const initialState = {
    isAuthed: false,
    loading: false,
    key: 0,
    token: '',
    user: null
}

const auth = handleActions({
    ['user/alipay/set/success'](state, action){
        return {
            ...state,
            user: {
                ...state.user,
                alipay: action.payload.alipay
            }
        }
    },
    ['user/set/success']: (state,action) => ({
        ...state,
        user: action.payload
    }),
    ['login/success'](state, action) {
        const {
            key,
            token,
            user
        } = action.payload
        return {
            ...state,
            key,
            token,
            isAuthed: true,
            loading: false,
            user
        }
    },
    ['login/start'](state) {
        return {
            ...state,
            loading: true
        }
    },
    ['login/failure'](state) {
        return {
            ...state,
            loading: false,
            isAuthed:false
        }
    },
    ['logout'](){
        return initialState
    }
}, initialState)

export default auth