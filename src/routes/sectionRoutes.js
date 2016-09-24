import Edit from '../components/Section/Edit.js'
import Choose from '../components/Section/Choose'
import AddTextPaper from '../components/Section/AddTextPaper'
import AddActive from '../components/Section/AddActive'
import AddBook from '../components/Section/AddBook'
import Draft from '../components/Section/Draft'
import AddHtml from '../components/Section/AddHtml'
import AddNotice from '../components/Section/AddNotice'

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
  }, {
    path: 'html',
    component: AddHtml
  }, {
      path: 'notice',
      component: AddNotice
  }]
})

const draftRoute = store => ({
    path: 'draft',
    component: Draft,
    onEnter (nextState, replace) {
        const lesson_id = nextState.location.query.lid
        const organize_id = nextState.location.query.oid
        if (!lesson_id || !organize_id) {
            return replace({ pathname: '/' })
        }
        store.dispatch({ type: 'section/info', payload: { params: {lesson_id, organize_id, state: 2} }})
        store.dispatch({ type: 'section/list', payload: {
            params: { 
            lesson_id, 
            state: 2, 
            offset: 1, 
            limit: 9,
            organize_id 
        }}})
    }
})

const editRoute = store =>({
    path: 'edit/:id',
    component: Edit,
    onEnter(nextState,replace){
        const id = nextState.params.id
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
        editRoute(store),
        draftRoute(store)
    ]
})

export default sectionRoute
