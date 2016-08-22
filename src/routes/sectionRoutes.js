import New from '../components/Section/New.js'
import Edit from '../components/Section/Edit.js'

const newRoute = store => ({
    path:'new/:id',
    component:New,
    onEnter(nextState,replace){
        const lid = nextState.params.id
        if( !lid ){
           return replace({pathname:'/'})
        }
        const uid = store.getState().auth.key
        store.dispatch({
            type:'yunbook/list',
            payload:{
                offset:1,
                limit:6
            }
        })
        store.dispatch({
            type:'yunbook/info',
            payload:{}
        })
        store.dispatch({
            type:'yunbook/mylist',
            payload:{
                offset:1,
                limit:6,
                account_id: uid
            }
        })
        store.dispatch({
            type:'yunbook/myinfo',
            payload:{
                account_id: uid
            }
        })
    }
})

const editRoute = store =>({
    path:'edit/:id',
    component:Edit,
    onEnter(nextState,replace){
        const id=nextState.params.id
        if(!id){
            return replace({
                pathname:'/'
            })
        }
        store.dispatch({
            type:'section/get',
            payload:{
                id
            }
        })
    }
})

const sectionRoute = store => ({
    path:'section',
    childRoutes:[
        newRoute(store),
        editRoute(store)
    ]
})

export default sectionRoute