import listContainer from '../containers/organize/listContainer.js'
import showContainer from '../containers/organize/showContainer'
import Edit from '../components/Organize/Edit'
import Bill from '../components/Organize/Bill'
import rechargeContainer from '../containers/organize/rechargeContainer'
import OrganizeLesson from '../components/Organize/organize_lesson'
import { ORGANIZE } from '../constants/api'

const showRoute = store => ({
    path:'show/:id',
    onEnter(nextState,replace){
        const id = nextState.params.id
        if( !id ){
            return replace({pathname:'/organize/list'})
        }
        store.dispatch({
            type: 'organize/get',
            payload: {
                params: { id }
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
            type:'organize_team/info',
            payload:{
                params: { role: 1, state: 1, account_id }
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
                params: { id }
            }
        })
    }
})
const billRoute = store => ({
    path: 'bill/:id',
    component: Bill, 
    onEnter(nextState, replace) {
        const id = nextState.params.id
        if( !id ){
            return replace({ pathname: '/' })
        }
        store.dispatch({
            type: 'bill/info',
            payload: {
                params: {
                    category_id: ORGANIZE,
                    foreign_id: id
                }
            }
        })
        store.dispatch({
            type: 'bill/list',
            payload: {
                params: {
                    category_id: ORGANIZE,
                    foreign_id: id,
                    limit: 9,
                    offset: 1
                }
            }
        })
    }
})

const rechargeRoute = store => ({
  path: 'recharge/:id',
  component: rechargeContainer,
  onEnter(nextState, replace) {
    const id = nextState.params.id
    if( !id ){
      return replace({ pathname: '/' })
    }
    store.dispatch({
        type: 'organize/get',
        payload: {
            params: { id }
        }
    })
  }
})

const lessonRoute = () => ({
    path: 'lesson/:id',
    component: OrganizeLesson,
    onEnter(nextState, replace) {
        const id = nextState.params.id
        if (!id) {
            replace({ pathname: '/' })
        }
    }
})

const organizeRoutes = store=>({
    path:'organize',
    childRoutes:[
        listRoute(store),
        showRoute(store),
        editRoutes(store),
        billRoute(store),
        rechargeRoute(store),
        lessonRoute()
    ]
})

export default organizeRoutes
