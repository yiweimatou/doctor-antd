import MainContainer from '../containers/MainContainer.js'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'
import organizeRoutes from './organizeRoutes.js'
import lessonRoutes from './lessonRoutes.js'
import yunbookRoutes from './yunbookRoutes'
import sectionRoutes from './sectionRoutes.js'
import userRoutes from './userRoutes'
import messageRoutes from './messageRoutes'
import questionRoutes from './questionRoutes'
import textPaperRoutes from './textPaperRoutes'
import paperRoutes from './paperRoutes'
import resourceRoutes from './resourceRoutes'
import { WECHATLOGIN} from '../constants/api'
import Schedule from '../components/schedule'
import h5Routes from './h5Routes'
import taskRoutes from './taskRoutes'
import recordRoutes from './recordRoutes'
import BusinessCard from '../components/BusinessCard/Personal'

const routes = (store) => ([{
    path: '/',
    component: MainContainer,
    indexRoute: {
        component: Dashboard
    },
    breadcrumbName: '主页',
    onEnter(nextState) {
        const { key, token } = nextState.location.query
        const auth = localStorage.auth
        if (key && token) {
          localStorage.auth = JSON.stringify({
            key, token
          })
          store.dispatch({
            type: 'login/success',
            payload: {
              key, token, user: { id: key }
            }
          })
          store.dispatch({
            type: 'user/set',
            payload: {
              id: key
            }
          })
        } else if (!auth) {
          window.location.replace(WECHATLOGIN)
        }
    },
    childRoutes: [{
            path: 'dashboard',
            component: Dashboard
        },
        organizeRoutes(store),
        lessonRoutes(store),
        yunbookRoutes(store),
        sectionRoutes(store),
        userRoutes(store),
        messageRoutes(store),
        questionRoutes(store),
        textPaperRoutes(store),
        paperRoutes(store),
        h5Routes,
        taskRoutes,
        recordRoutes,
        resourceRoutes(),
        {
          path: 'schedule',
          component: Schedule
      },
      {
          path: 'businesscard',
          component: BusinessCard
      }
    ]
}, {
    path: '*',
    component: NotFound
}])

export default routes
