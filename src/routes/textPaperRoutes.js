/**
 * Created by zhangruofan on 2016/9/18.
 */
import Add from '../components/TextPaper/Add'
import Show from '../components/TextPaper/Show'
import List from '../components/TextPaper/List'

const addRoute = () => ({
  path: 'add',
  component: Add
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
    addRoute(), showRoute(), listRoute()
  ]
})

export default textPaperRoutes
