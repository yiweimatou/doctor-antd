import listContainer from '../containers/organize/listContainer.js'
import showContainer from '../containers/organize/showContainer'
import Edit from '../components/Organize/Edit'
import Bill from '../components/Organize/Bill'
import rechargeContainer from '../containers/organize/rechargeContainer'
import OrganizeLesson from '../components/Organize/organize_lesson'
import { ORGANIZE } from '../constants/api'
import Draft from '../components/Section/Draft'
import SectionList from  '../components/Section/List'
import OrganizeTeam from '../components/Organize/organize_team'
import List from '../components/Organize/link/list'
import OrganizeBusinessCard from '../components/Organize/Card'

const teamRoute = store => ({
    path: ':id/team',
    component: OrganizeTeam,
    onEnter(nextState) {
        const id = nextState.params.id
        store.dispatch({
            type: 'organize/get',
            payload: {
                params: {
                    id
                }
            }
        })
    }
})

const sectionRoute = store => ({
    path: 'section',
    component: SectionList,
    onEnter(nextState) {
        const id = nextState.location.query.oid
        store.dispatch({
            type: 'organize/get',
            payload: {
                params: {
                    id
                }
            }
        })
    }
})

const draftRoute = store => ({
    path: 'draft',
    component: Draft,
    onEnter(nextState) {
        const id = nextState.location.query.oid
        store.dispatch({
            type: 'organize/get',
            payload: {
                params: {
                    id
                }
            }
        })
    }
})

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

const listRoute = () => ({
    path:'list',
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

const lessonRoute = (store) => ({
    path: 'lesson/:id',
    component: OrganizeLesson,
    onEnter(nextState, replace) {
        const id = nextState.params.id
        if (id) {
            store.dispatch({
                type: 'organize/get',
                payload: {
                    params: { id }
                }
            })
        } else {
            replace({ pathname: '/' })            
        }
        
    }
})

const cardRoute = store => ({
    path: 'card/:id',
    component: OrganizeBusinessCard,
    onEnter: (nextState) => {
        const id = nextState.params.id
        store.dispatch({
            type: 'organize/get',
            payload: {
                params: { id }
            }
        })
    }
})
const organizeRoutes = store =>({
    path:'organize',
    childRoutes:[
        listRoute(store),
        showRoute(store),
        editRoutes(store),
        billRoute(store),
        rechargeRoute(store),
        lessonRoute(store),
        sectionRoute(store),
        draftRoute(store),
        teamRoute(store),
        cardRoute(store),
        {
            path: 'link/:id',
            component: List
        },
    ]
})

export default organizeRoutes
