import Add from '../components/h5/add'
import List from '../components/h5/list'
import Manage from '../components/h5/manage'

const h5Routes = {
    path: 'h5',
    childRoutes: [{
        path: 'add',
        component: Add
    }, {
        path: 'manage',
        component: Manage
    }, {
        path: 'list',
        component: List
    }]
}

export default h5Routes