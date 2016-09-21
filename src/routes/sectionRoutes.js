// import New from '../components/Section/New.js'
import Edit from '../components/Section/Edit.js'
import Choose from '../components/Section/Choose'
import AddTextPaper from '../components/Section/AddTextPaper'
import AddActive from '../components/Section/AddActive'
import AddBook from '../components/Section/AddBook'

const newRoute = () => ({
  path: 'add',
  childRoutes: [{
    path: 'textpaper',
    component: AddTextPaper
  }, {
    path: 'book',
    component: AddBook
  }, {
    path: 'active',
    component: AddActive
  }, {
    path: 'choose',
    component: Choose
  }]
})

const editRoute = store =>({
    path:'edit/:id',
    component:Edit,
    onEnter(nextState,replace){
        const id=nextState.params.id
        if(!id){
            return replace({
                pathname:'/'
            })
        }
        store.dispatch({
            type:'section/get',
            payload:{
                id
            }
        })
    }
})

const sectionRoute = store => ({
    path:'section',
    childRoutes:[
        newRoute(store),
        editRoute(store)
    ]
})

export default sectionRoute
