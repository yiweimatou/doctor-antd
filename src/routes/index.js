import App from '../components/App'
import NotFound from '../components/NotFound'
import Dashboard from '../components/Dashboard'

const routes = store => ([{
    path: '/',
    component: App,
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