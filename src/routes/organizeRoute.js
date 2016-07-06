import listContainer from '../containers/organize/listContainer.js'

const listRoute = store => ({
    path:'list',
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'organize/list',
            payload:{
                limit:9,
                offset:1,
                uid
            }
        })
        store.dispatch({
            type:'organize/info',
            payload:{
                uid
            }
        })
    },
    component:listContainer
})

const organizeRoute = store=>({
    path:'organize',
    childRoutes:[
        listRoute(store)
    ]
})

export default organizeRoute