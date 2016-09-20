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
import eventRoutes from './eventRoutes'
import questionRoutes from './questionRoutes'
import textPaperRoutes from './textPaperRoutes'

const routes = (store) => ([{
    path: '/',
    component: MainContainer,
    indexRoute: {
        component: Dashboard
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
        eventRoutes(store),
        questionRoutes(store),
        textPaperRoutes(store)
    ]
}, {
    path: '*',
    component: NotFound
}])

export default routes
