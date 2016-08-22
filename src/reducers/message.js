import { handleActions } from 'redux-actions'

const initialState = {
    record: null,
    records: null,
    loading: false,
    params: {
        limit: 6,
        offset: 1
    },
    total: 0,
    error: null
}

const message = handleActions({
    ['message/fetchinfo']: state => ({
        ...state,
        total: 0
    }),
    ['message/fetchinfo/success']: (state, action) => ({
        ...state,
        total: action.payload
    }),
    ['message/fetchinfo/failure']: (state, action) => ({
        ...state,
        error: action.payload
    }),
    ['message/fetchlist']: state => ({
        ...state,
        loading: true
    }),
    ['message/fetchlist/success']: (state, action) => ({
        ...state,
        records: action.payload.data,
        params: action.payload.params,
        loading: false
    }),
    ['message/fetchlist/failure']: (state, action) => ({
        ...state,
        error: action.payload,
        loading: false
    })
}, initialState)

export default message