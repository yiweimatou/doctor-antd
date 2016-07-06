import MainContainer from '../containers/MainContainer.js'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'
import organizeRoute from './organizeRoute.js'

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
        organizeRoute(store)
    ]
}, {
    path: '*',
    component: NotFound
}])
export default routes