/**
 * Created by zhangruofan on 2016/9/18.
 */
import Add from '../components/TextPaper/Add'
import Show from '../components/TextPaper/Show'
import List from '../components/TextPaper/List'
import Manage from '../components/TextPaper/Manage'

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

const textPaperRoutes = () => ({
  path: 'textpaper',
  childRoutes: [
    addRoute(), showRoute(), listRoute(), manageRoute()
  ]
})

export default textPaperRoutes
