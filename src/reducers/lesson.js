import { handleActions } from 'redux-actions'

const initialState = {
	loading:false,
	entity:null,
	list:{
		data:[],
		pageParams:{
			limit:6,
			offset:1
		},
		total:0
	}
}

const lesson = handleActions({
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
	['lesson/list']:(state,action)=>({
		...state,
		loading:true,
		list:{
			...state.list,
			pageParams:action.payload,
			data:[]
		}
	}),
	['lesson/list/success']:(state,action)=>({
		...state,
		loading:false,
		list:{
			...state.list,
			...action.payload
		}
	}),
	['lesson/list/failure']:(state)=>({
		...state,
		loading:false
	}),
	['lesson/info']:state=>({
		...state,
		list:{
			...state.list,
			total:0
		}
	}),
	['lesson/info/success']:(state,action)=>({
		...state,
		list:{
			...state.list,
			total:action.payload.total
		}
	}),
	['lesson/tinfo']:state=>({
		...state,
		tlist:{
			...state.tlist,
			total:0
		}
	}),
	['lesson/tinfo/success']:(state,action)=>({
		...state,
		tlist:{
			...state.tlist,
			total:action.payload.total
		}
	}),
	['lesson/get']:(state)=>({
		...state,
		entity:null
	}),
	['lesson/get/success']:(state,action)=>({
		...state,
		entity:action.payload.entity
	})
},initialState)

export default lesson