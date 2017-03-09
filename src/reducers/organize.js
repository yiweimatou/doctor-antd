import { handleActions } from 'redux-actions'

const initialState = {
    list: [],
    loading: false,
    total: 0,
    entity: {},
    lessons: []
}

const organize = handleActions({
    ['organize/lesson/list']: state => ({
        ...state,
        loading: true
    }),
    ['organize/lesson/list/failre']: state => ({
        ...state,
        loading: false
    }),
    ['organize/lesson/list/success']: (state, action) => ({
        ...state,
        lessons: action.payload,
        loading: false
    }),
    ['organzie/edit']: state=>({
        ...state,
        loading: true
    }),
    ['organize/edit/success']: (state, action) => ({
        ...state,
        entity: {
            ...state.entity,
            ...action.payload
        },
        loading:false
    }),
    ['organize/edit/failure']: state => ({
        ...state,
        loading: false
    }),
    ['organize/list']: state => ({
        ...state,
        loading: true,
        list: []
    }),
    ['organize/list/success']: (state,action) => ({
        ...state,
        loading: false,
        list: action.payload
    }),
    ['organize/list/failure']: state => ({
        ...state,
        loading: false
    }),
    ['organize_team/info']: state => ({
      ...state,
      total: 0
    }),
    ['organize_team/info/success']: (state, action) => ({
        ...state,
        total: action.payload
    }),
    // ['organize/get']:(state)=>({
    //     ...state,
    //     loading: true,
    //     entity: {}
    // }),
    ['organize/get/failure']: state => ({
      ...state,
    //   loading: false
    }),
    ['organize/get/success']: (state, action) => ({
        ...state,
        // loading: false,
        entity: action.payload.entity
    })
},initialState)

export default organize
