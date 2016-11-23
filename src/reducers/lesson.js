import { handleActions } from 'redux-actions'

const initialState = {
	loading: false,
	entity: {},
	list: [],
	unnormallist: []
}

const lesson = handleActions({
  ['lesson/list/unnormal']: state => ({
    ...state,
    unnormallist: []
  }),
  ['lesson/list/unnormal/success']: (state, action) => ({
    ...state,
    unnormallist: action.payload
  }),
	['lesson/edit']: state => ({
		...state,
		isSuccess: false,
		loading: true
	}),
	['lesson/edit/success']: (state, action) => ({
		...state,
		isSuccess: true,
		loading: false,
		entity: {
			...state.entity,
			...action.payload
		}
	}),
	['lesson/edit/failure']: state => ({
		...state,
		isSuccess: false,
		loading: false
	}),
	['lesson/recommend']:state=>({
		...state,
		loading:true
	}),
	['lesson/recommend/success']:state=>({
		...state,
		loading:false
	}),
	['lesson/recommend/failure']:state=>({
		...state,
		loading:false
	}),
	['lesson/put/cet']:state => ({
		...state,
		loading:true
	}),
	['lesson/put/cet/success']: (state, action) => ({
		...state,
		loading:false,
		list:{
			...state.list,
			data:state.list.data.map(item => {
				if(item.id === action.payload.id){
					return {
						...item,
						...action.payload
					}
				}
				return item
			})
		}
	}),
	['lesson/put/cet/failure'] : state => ({
		...state,
		loading:false
	}),
	['lesson/new']:(state)=>({
		...state,
		loading:true
	}),
	['lesson/new/success']:state=>({
		...state,
		loading:false
	}),
	['lesson/new/failure']:state=>({
		...state,
		loading:false
	}),
	['lesson/list']: state => ({
		...state,
		loading: true,
		list: []
	}),
	['lesson/list/success']: (state, action) => ({
		...state,
		loading: false,
		list: action.payload
	}),
	['lesson/list/failure']: state => ({
		...state,
		loading: false
	}),
	['lesson/get/success']: (state, action) => ({
		...state,
		entity:	action.payload.entity
	})
}, initialState)

export default lesson
