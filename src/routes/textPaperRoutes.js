/**
 * Created by zhangruofan on 2016/9/18.
 */
import Add from '../components/TextPaper/Add'
import Show from '../components/TextPaper/Show'

const addRoute = () => ({
  path: 'add',
  component: Add
})

const showRoute = () => ({
  path: 'show',
  component: Show
})

const textPaperRoutes = () => ({
  path: 'textpaper',
  childRoutes: [
    addRoute(), showRoute()
  ]
})

export default textPaperRoutes
