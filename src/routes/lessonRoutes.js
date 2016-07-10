import newContainer from '../containers/lesson/newContainer.js'
import showContainer from '../containers/lesson/showContainer.js'
import listContainer from '../containers/lesson/listContainer.js'
import tlistContainer from '../containers/lesson/tlistContainer.js'

const newRoute = ()=> ({
    path:'new',
    component:newContainer
})

const showRoute = store => ({
    path:'show/:id',
    component:showContainer,
    onEnter(nextState,replace){
        const lid = nextState.params.id
        if( !lid ){
            return replace({pathname:'/'})
        }
        store.dispatch({
            type:'organizeLesson/list',
            payload:{
                lid
            }
        })
        store.dispatch({
            type:'lesson/get',
            payload:{
                lid
            }
        })
        store.dispatch({
            type:'lessonTeam/list',
            payload:{
                lid
            }
        })
    }
})

const listRoute = store => ({
    path:'list',
    component:listContainer,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'lesson/info',
            payload:{
                uid
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                limit:6,
                offset:1,
                uid
            }
        })
    }
})

const tlistRoute = store => ({
    path:'tlist',
    component:tlistContainer,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'lessonTeam/list',
            payload:{
                limit:6,
                offset:1,
                uid
            }
        })
    }
})

const lessonRoutes = store => ({
    path:'lesson',
    childRoutes:[
        newRoute(),
        showRoute( store ),
        listRoute(store),
        tlistRoute(store)
    ]
})

export default lessonRoutes