import {
    handleActions
} from 'redux-actions'

const auth = handleActions({
    ['login/success'](state, action) {
        const {
            key,
            token,
            user,
            lastModifyTime
        } = action.payload
        return {...state,
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
    }
}, {
    isAuthed: false,
    loading: false,
    key: 0,
    token: '',
    user: null,
    lastModifyTime: 0
})

export default auth