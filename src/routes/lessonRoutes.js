import newContainer from '../containers/lesson/newContainer.js'
import showContainer from '../containers/lesson/showContainer.js'
import listContainer from '../containers/lesson/listContainer.js'
import List from '../components/Lesson/Tlist'
import editContainer from '../components/Lesson/Edit.js'
import Recommend from '../components/Lesson/Recommend'
import RecommendList from '../components/Lesson/RecommendList'
import RecommendManage from '../components/Lesson/RecommendManage'
import Bill from '../components/Lesson/Bill'

const billRoute = () => ({
    path: 'bill',
    component: Bill
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
                account_id: uid
            }
        })
        store.dispatch({
            type:'lesson/list',
            payload:{
                account_id: uid
            }
        })
    }
})

const newRoute = () => ({
    path:'new',
    component:newContainer
})

const showRoute = () => ({
    path:'show/:id',
    component:showContainer
})

const listRoute = () => ({
    path:'list',
    component:listContainer
})

const tlistRoute = () => ({
    path:'tlist',
    component:List
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
        showRoute(),
        listRoute(),
        tlistRoute(),
        editRoute(store),
        recommendListRoute(store),
        recommendRoute(),
        recommendManageRoute(store),
        billRoute()
    ]
})

export default lessonRoutes
