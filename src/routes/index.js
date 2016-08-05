import MainContainer from '../containers/MainContainer.js'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'
import organizeRoutes from './organizeRoutes.js'
import lessonRoutes from './lessonRoutes.js'
import yunbookRoutes from './yunbookRoutes'
import sectionRoutes from './sectionRoutes.js'
import inviteRoutes from './inviteRoutes'

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
        organizeRoutes(store),
        lessonRoutes(store),
        yunbookRoutes(store),
        sectionRoutes(store),
        inviteRoutes(store)
    ]
}, {
    path: '*',
    component: NotFound
}])

export default routes