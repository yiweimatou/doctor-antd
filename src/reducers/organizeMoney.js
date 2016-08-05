import { handleActions } from 'redux-actions'

const initialState = {
    data: [],
    params: {
        limit: 6,
        offset: 1
    },
    total: 0,
    loading: false
}

const organzieMoney = handleActions({
    ['organize/money/list']: state => ({
        ...state,
        data: [],
        loading: true
    }),
    ['organize/money/list/success']: (state, action) => ({
        ...state,
        data: action.payload.list,
        params: action.payload.params,
        loading: false
    }),
    ['organize/money/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['organize/money/info/success']: (state, action) => ({
        ...state,
        total: action.payload
    })
},initialState)

export default organzieMoney