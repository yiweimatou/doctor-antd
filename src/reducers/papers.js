// import { handleActions } from 'redux-actions'

// const initialState = {
//     list: [],
//     total: 0,
//     loading: false
// } 

// const papers = handleActions({
//     ['papers/list']:  state => ({
//         ...state,
//         list: [],
//         loading: true
//     }),
//     ['papers/list/success']: (state, action) => ({
//         ...state,
//         list: action.payload,
//         loading: false
//     }),
//     ['papers/list/failure']: state => ({
//         ...state,
//         loading: false
//     }),
//     ['papers/info/success']: (state, action) => ({
//         ...state,
//         total: action.payload
//     })
// }, initialState)

// export default papers