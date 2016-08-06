import listContainer from '../containers/organize/listContainer.js'
import showContainer from '../containers/organize/showContainer'
import Edit from '../components/Organize/Edit'
import Money from '../components/Organize/Money'

const showRoute = store => ({
    path:'show/:id',
    onEnter(nextState,replace){
        const id = nextState.params.id
        if( !id ){
            return replace({pathname:'/organize/list'})
        }
        const organize = store.getState().organize
        if(organize&&organize.list){
            const entity = organize.list.find(item=>{
                return item.id===id
            })
            if( entity ){
                return store.dispatch({
                    type:'organize/get/success',
                    payload:{
                        entity
                    }
                })
            }else {
                store.dispatch({
                    type:'organize/get',
                    payload:{
                        id
                    }
                })
            }
        }
        store.dispatch({
            type:'organizeLesson/info',
            payload:{
                organize_id:id
            }
        })
        store.dispatch({
            type:'organizeLesson/list',
            payload:{
                organize_id:id,
                limit:6,
                offset:1
            }
        })
    },
    component:showContainer
})

const listRoute = store => ({
    path:'list',
    onEnter(){
        const account_id = store.getState().auth.key
        store.dispatch({
            type:'organize/list',
            payload:{
                limit:6,
                offset:1,
                account_id
            }
        })
        store.dispatch({
            type:'organize/info',
            payload:{
                account_id
            }
        })
    },
    component:listContainer
})

const editRoutes = store => ({
    path:'edit/:id',
    component:Edit,
    onEnter(nextState,replace){
        const id = nextState.params.id
        if(!id){
            return replace({
                pathname:'/'
            })
        }
        store.dispatch({
            type:'organize/get',
            payload:{
                id
            }
        })
    }
})
const moneyRoute = store => ({
    path: 'money/:id',
    component: Money,
    onEnter(nextState, replace) {
        const id = nextState.params.id
        if(!id) {
            return replace({ pathname: '/'})
        }
        store.dispatch({
            type: 'organize/money/info',
            payload: { organize_id: id }
        })
        store.dispatch({
            type: 'organize/money/list',
            payload: {
                organize_id: id
            }
        })
    }
})
const organizeRoutes = store=>({
    path:'organize',
    childRoutes:[
        listRoute(store),
        showRoute(store),
        editRoutes(store),
        moneyRoute(store)
    ]
})

export default organizeRoutes