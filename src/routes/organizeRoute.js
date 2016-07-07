import listContainer from '../containers/organize/listContainer.js'
import showContainer from '../containers/organize/showContainer'

const showRoute = store => ({
    path:'show/:id',
    onEnter(nextState,replace){
        const oid = nextState.params.id
        if( !oid ){
            return replace({pathname:'/organize/list'})
        }
        const organize = store.getState().organize
        if(organize&&organize.list){
            const entity = organize.list.find(item=>{
                return item.oid===oid
            })
            if( entity ){
                return store.dispatch({
                    type:'organize/get/success',
                    payload:{
                        entity
                    }
                })
            }
        }
        store.dispatch({
            type:'organize/get',
            payload:{
                oid
            }
        })
    },
    component:showContainer
})

const listRoute = store => ({
    path:'list',
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'organize/list',
            payload:{
                limit:6,
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
        listRoute(store),
        showRoute(store)
    ]
})

export default organizeRoute