/**
 * Created by zhangruofan on 2016/9/18.
 */
import Add from '../components/TextPaper/Add'
import Show from '../components/TextPaper/Show'
import List from '../components/TextPaper/List'
import Manage from '../components/TextPaper/Manage'
import Edit from '../components/TextPaper/Edit'
import { message } from 'antd'

const addRoute = () => ({
  path: 'add',
  component: Add
})

const manageRoute = () => ({
  path: 'manage',
  component: Manage
})

const listRoute = () => ({
  path: 'list',
  component: List
})

const showRoute = () => ({
  path: 'show',
  component: Show
})

const editRoute = store => ({
  path: 'edit/:id',
  component: Edit,
  onEnter(nextState, replace) {
    const id = nextState.params.id
    if(!id){
        return replace({
            pathname:'/'
        })
    }
    store.dispatch({
      type: 'topics/get',
      payload: { params: {id}, reject: error => message.error(error) }
    })
  }
})

const textPaperRoutes = store => ({
  path: 'textpaper',
  childRoutes: [
    addRoute(), showRoute(), listRoute(), manageRoute(), editRoute(store)
  ]
})

export default textPaperRoutes
