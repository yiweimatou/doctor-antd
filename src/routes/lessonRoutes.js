import newContainer from '../containers/lesson/newContainer.js'
import showContainer from '../containers/lesson/showContainer.js'
import listContainer from '../containers/lesson/listContainer.js'
import List from '../components/Lesson/Tlist'
import editContainer from '../components/Lesson/Edit.js'
import Bill from '../components/Lesson/Bill'
import Team from '../components/Lesson/Team'
import SectionList from '../components/Section/List'


const sectionListRoute = () => ({
    path: 'section',
    component: SectionList,
    onEnter(nextState, replace) {
       if (nextState.location.query.id === undefined) {
           replace({
               pathname: '/'
           })
       }
    }
})

const teamRoute = store => ({
    path: 'team',
    component: Team,
    onEnter(nextState, replace) {
        if (nextState.location.query.id === undefined) {
           replace({
               pathname: '/'
           })
       } else {
           store.dispatch({
               type: 'lesson/get',
               payload: {
                    id: nextState.location.query.id
               }
           })
       }
    }
})

const billRoute = () => ({
    path: 'bill',
    component: Bill
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
        billRoute(),
        teamRoute(store),
        sectionListRoute()
    ]
})

export default lessonRoutes
