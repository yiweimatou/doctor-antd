import newContainer from '../containers/lesson/newContainer.js'
import showContainer from '../containers/lesson/showContainer.js'
import listContainer from '../containers/lesson/listContainer.js'
import tlistContainer from '../containers/lesson/tlistContainer.js'
import editContainer from '../components/Lesson/Edit.js'
import Recommend from '../components/Lesson/Recommend'
import RecommendList from '../components/Lesson/RecommendList'
import RecommendManage from '../components/Lesson/RecommendManage'
import Money from '../components/Lesson/Money'

const moneyRoute = store => ({
    path: 'money/:id',
    component: Money,
    onEnter(nextState, replace) {
        const id = nextState.params.id
        if( !id ) {
            return replace({ pathname: '/'})
        }
        store.dispatch({
            type: 'money/info',
            payload: { foreign_id: id, type: 2 }
        })
        store.dispatch({
            type: 'money/fetchlist',
            payload: { foreign_id: id, type: 2 }
        })
    }
})

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
                rcmd_account_id:uid
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                rcmd_account_id:uid
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
                account_id: uid,
                cet:2
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                account_id: uid,
                cet:2
            }
        })
    }
})

const newRoute = () => ({
    path:'new',
    component:newContainer
})

const showRoute = store => ({
    path:'show/:id',
    component:showContainer,
    onEnter(nextState,replace){
        const id = nextState.params.id
        if( !id ){
            return replace({pathname:'/'})
        }
        store.dispatch({
            type:'organizeLesson/list',
            payload:{
                lesson_id: id,
                cet:4
            }
        })
        store.dispatch({
                type:'organize/info',
                payload:{}
        })
        store.dispatch({
            type:'lesson/get',
            payload:{
                id
            }
        })
        store.dispatch({
            type:'lessonTeam/list',
            payload:{
                lesson_id: id
            }
        })
        store.dispatch({
            type: 'section/info',
            payload: {
                lesson_id: id
            }
        })
        store.dispatch({
            type: 'section/info',
            payload: {
                lesson_id: id
            }
        })
        store.dispatch({
            type:'section/list',
            payload:{
                limit:6,
                offset:1,
                lesson_id: id
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
                account_id :uid,
                cet:4
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                limit:6,
                offset:1,
                account_id :uid,
                cet:4
            }
        })
    }
})

const tlistRoute = store => ({
    path:'tlist',
    component:tlistContainer,
    onEnter(){
        const id = store.getState().auth.key
        store.dispatch({
            type:'lessonTeam/list',
            payload:{
                limit:1000,
                offset:1,
                account_id: id,
                cet:4
            }
        })
    }
})

const editRoute = store =>({
    path:'edit/:id',
    component:editContainer,
    onEnter(nextState,replace){
        const id=nextState.params.id
        if(!id){
            return replace({
                pathname:'/'
            })
        }
        store.dispatch({
            type:'lesson/get',
            payload:{
                id
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
        recommendManageRoute(store),
        moneyRoute(store)
    ]
})

export default lessonRoutes
