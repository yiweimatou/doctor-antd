import { handleActions } from 'redux-actions'

const initialState = {
    list: [],
    total: 0,
    entity: null,
    loading: false
}

const section = handleActions({
    ['section/add']: state => ({
      ...state,
      loading: true
    }),
    ['section/add/success']: state => ({
      ...state,
      loading: false
    }),
    ['section/add/failure']: state => ({
      ...state,
      loading: false
    }),
    ['section/delete/success']: (state, action) => ({
        ...state,
        list: state.list.filter(item => item.id !== action.payload.id),
        total: state.total -1 
    }),
    ['section/get']:state=>({
        ...state,
        loading: true
    }),
    ['section/get/success']: (state, action) => ({
        ...state,
        entity: action.payload,
        loading: false
    }),
    ['section/get/failure']: state => ({
        ...state,
        loading: false
    }),
    ['section/edit']: state => ({
        ...state,
        loading: true
    }),
    ['section/edit/success']: (state, action) => ({
        ...state,
        loading: false,
        entity: {
          ...state.entity,
          ...action.payload
        }
    }),
    ['section/edit/failure']: state => ({
        ...state,
        loading: false
    }),
    ['section/list']: state => ({
        ...state,
        loading: true,
        list: []
    }),
    ['section/list/success']: (state, action) => ({
        ...state,
        loading: false,
        list: action.payload
    }),
    ['section/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['section/info']: state => ({
        ...state,
        total: 0
    }),
    ['section/info/success']: (state, action) => ({
        ...state,
        total: action.payload
    })
}, initialState)

export default section

