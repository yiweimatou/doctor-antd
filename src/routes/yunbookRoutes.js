// import New from '../components/Yunbook/New.js'
// import List from '../components/Yunbook/List.js'
import Show from '../components/Yunbook/Show.js'
import Edit from '../components/Yunbook/Edit.js'
import Manage from '../components/Yunbook/Manage'

// const newRoutes = () => ({
//     path:'new',
//     component:New
// })

const manageRoute = store => ({
    path: 'manage',
    component: Manage,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'yunbook/myinfo',
            payload:{
                account_id: uid
            }
        })
        store.dispatch({
            type:'yunbook/mylist',
            payload:{
                account_id: uid,
                limit: 6,
                offset: 1
            }
        })
    }
})

// const listRoute = store => ({
//     path: 'list',
//     component:List,
//     onEnter(){
//         const uid = store.getState().auth.key
//         store.dispatch({
//             type:'yunbook/myinfo',
//             payload:{
//                 account_id: uid
//             }
//         })
//         store.dispatch({
//             type:'yunbook/mylist',
//             payload:{
//                 account_id: uid,
//                 limit: 6,
//                 offset: 1
//             }
//         })
//     }
// })

const showRoute = () => ({
    path:'show',
    component:Show,
    onEnter(nextState,replace){
        const id = nextState.location.query.yid
        if(!id){
            return replace({
                pathname:'/yunbook/list'
            })
        }
    }
})

const editRoute = () => ({
    path:'edit/:id',
    component:Edit,
    onEnter(nextState,replace){
        const id = nextState.params.id
        if(!id){
            return replace({
                pathname:'/yunbook/list'
            })
        }
        // store.dispatch({
        //     type:'yunbook/get',
        //     payload:{
        //         id
        //     }
        // })
    }
})

const yunbookRoutes = store => ({
    path:'yunbook',
    childRoutes:[
        showRoute(),
        editRoute(),
        manageRoute(store)
    ]
})

export default yunbookRoutes