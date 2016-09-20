/**
 * Created by zhangruofan on 2016/9/18.
 */
import Add from '../components/TextPaper/Add'

const addRoute = () => ({
  path: 'add',
  component: Add
})

const textPaperRoutes = () => ({
  path: 'textpaper',
  childRoutes: [
    addRoute()
  ]
})

export default textPaperRoutes
