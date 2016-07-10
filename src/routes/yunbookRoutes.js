import New from '../components/Yunbook/New.js'
import List from '../components/Yunbook/List.js'

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
                uid
            }
        })
    }
})

const yunbookRoutes = store => ({
    path:'yunbook',
    childRoutes:[
        newRoutes(),
        listRoute(store)
    ]
})

export default yunbookRoutes