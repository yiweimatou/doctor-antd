import Choose from '../components/Section/Choose'
import AddTextPaper from '../components/Section/AddTextPaper'
import AddActive from '../components/Section/AddActive'
import AddBook from '../components/Section/AddBook'
import Draft from '../components/Section/Draft'
import AddHtml from '../components/Section/AddHtml'
import AddNotice from '../components/Section/AddNotice'
import AddH5 from '../components/Section/AddH5'

const newRoute = (store) => ({
  path: 'add',
  onEnter: (nextState) => {
      const organize_id = nextState.location.query.oid
      if (organize_id > 0) {
          store.dispatch({
              type: 'organize/get',
              payload: {
                  params: { id: organize_id }
              }
          })
      }
  },
  childRoutes: [{
    path: 'topics',
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
  }, {
      path: 'h5',
      component: AddH5
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

const sectionRoute = store => ({
    path:'section',
    childRoutes:[
        newRoute(store),
        draftRoute(store)
    ]
})

export default sectionRoute
