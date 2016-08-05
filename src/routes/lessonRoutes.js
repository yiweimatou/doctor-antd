import newContainer from '../containers/lesson/newContainer.js'
import showContainer from '../containers/lesson/showContainer.js'
import listContainer from '../containers/lesson/listContainer.js'
import tlistContainer from '../containers/lesson/tlistContainer.js'
import editContainer from '../components/Lesson/Edit.js'
import Recommend from '../components/Lesson/Recommend'
import RecommendList from '../components/Lesson/RecommendList'
import RecommendManage from '../components/Lesson/RecommendManage'

const recommendRoute = ()=> ({
    path:'recommend',
    component:Recommend
})

const recommendListRoute = store => ({
    path:'recommend/list',
    component:RecommendList,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'lesson/info',
            payload:{
                rcmd_uid:uid
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                rcmd_uid:uid
            }
        })
    }
})

const recommendManageRoute = store => ({
    path:'recommend/manage',
    component:RecommendManage,
    onEnter(){
        const uid = store.getState().auth.key
        store.dispatch({
            type:'lesson/info',
            //我是主讲没有认证的课程=推荐给我的课程
            payload:{
                uid,
                cet:2
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                uid,
                cet:2
            }
        })
    }
})

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
                lid,
                cet:4
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
        store.dispatch({
            type: 'section/info',
            payload: {
                lid
            }
        })
        store.dispatch({
            type:'section/list',
            payload:{
                limit:6,
                offset:1,
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
                uid,
                cet:4
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                limit:6,
                offset:1,
                uid,
                cet:4
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
                uid,
                cet:4
            }
        })
    }
})

const editRoute = store =>({
    path:'edit/:id',
    component:editContainer,
    onEnter(nextState,replace){
        const lid=nextState.params.id
        if(!lid){
            return replace({
                pathname:'/'
            })
        }
        store.dispatch({
            type:'lesson/get',
            payload:{
                lid
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
        tlistRoute(store),
        editRoute(store),
        recommendListRoute(store),
        recommendRoute(),
        recommendManageRoute(store)
    ]
})

export default lessonRoutes