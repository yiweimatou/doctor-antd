import MainContainer from '../containers/MainContainer.js'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'

const routes = store => ([{
    path: '/',
    component: MainContainer,
    indexRoute: {
        component: Dashboard
    },
    childRoutes: [{
        path: 'dashboard',
        component: Dashboard
    }]
}, {
    path:'*',
    component:NotFound
}
])
export default routes