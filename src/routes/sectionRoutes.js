import New from '../components/Section/New.js'

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
            payload:{

            }
        })
        store.dispatch({
            type:'yunbook/mylist',
            payload:{
                offset:1,
                limit:6,
                uid
            }
        })
        store.dispatch({
            type:'yunbook/myinfo',
            payload:{
                uid
            }
        })
    }
})

// const editRoute = store =>({
//     path:'edit/:id',
//     component:
// })

const sectionRoute = store => ({
    path:'section',
    childRoutes:[
        newRoute(store)
    ]
})

export default sectionRoute