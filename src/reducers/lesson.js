import { handleActions } from 'redux-actions'

const initialState = {
	loading: false,
	isSuccess: false, 
	entity:null,
	list:{
		data:[],
		pageParams:{
			limit:6,
			offset:1
		},
		otherInfos: null,
		total:0
	},
	money: {
		data: [],
		params: {
			limit: 6,
			offset: 1
		},
		total: 0,
		loading: false
	}
}

const lesson = handleActions({
	['lesson/money/info/success']: (state, action) => ({
		...state,
		money: {
			...state.money,
			total: action.payload
		}
	}),
	['lesson/money/list']: state => ({
		...state,
		money: {
			...state.money,
			loading: true
		}
	}),
	['lesson/money/list/success']: (state, action) => ({
		...state,
		money: {
			...state.money,
			loading: false,
			data: action.payload.list,
			params: action.payload.params
		}
	}),
	['lesson/money/list/failure']: state => ({
		...state,
		money: {
			...state.money,
			loading: false
		}
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