import MainContainer from '../containers/MainContainer.js'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'
import organizeRoutes from './organizeRoutes.js'
import lessonRoutes from './lessonRoutes.js'
import yunbookRoutes from './yunbookRoutes'
import sectionRoutes from './sectionRoutes.js'
import userRoutes from './userRoutes'
import messageRoutes from './messageRoutes'
import Test from '../components/Test'
import questionRoutes from './questionRoutes'
import textPaperRoutes from './textPaperRoutes'
import paperRoutes from './paperRoutes'
import resourceRoutes from './resourceRoutes'
import { WECHATLOGIN} from '../constants/api'

const routes = (store) => ([{
    path: '/',
    component: MainContainer,
    indexRoute: {
        component: Dashboard
    },
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
        {
            path:'test',
            component:Test
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
        resourceRoutes()
    ]
}, {
    path: '*',
    component: NotFound
}])

export default routes
