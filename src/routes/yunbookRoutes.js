import New from '../components/Yunbook/New.js'
import List from '../components/Yunbook/List.js'
import Show from '../components/Yunbook/Show.js'
import Edit from '../components/Yunbook/Edit.js'

const newRoutes = () => ({
    path:'new',
    component:New
})

const listRoute = store => ({
    path:'list',
    component:List,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'yunbook/myinfo',
            payload:{
                uid
            }
        })
        store.dispatch({
            type:'yunbook/mylist',
            payload:{
                uid,
                limit: 6,
                offset: 1
            }
        })
    }
})

const showRoute = store => ({
    path:'show/:id',
    component:Show,
    onEnter(nextState,replace){
        const bid = nextState.params.id
        if(!bid){
            return replace({
                pathname:'/yunbook/list'
            })
        }
        store.dispatch({
            type:'yunbook/get',
            payload:{
                bid
            }
        })
    }
})

const editRoute = store => ({
    path:'edit/:id',
    component:Edit,
    onEnter(nextState,replace){
        const bid = nextState.params.id
        if(!bid){
            return replace({
                pathname:'/yunbook/list'
            })
        }
        store.dispatch({
            type:'yunbook/get',
            payload:{
                bid
            }
        })
    }
})

const yunbookRoutes = store => ({
    path:'yunbook',
    childRoutes:[
        newRoutes(),
        listRoute(store),
        showRoute(store),
        editRoute(store)
    ]
})

export default yunbookRoutes