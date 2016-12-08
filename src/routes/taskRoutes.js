import Add from '../components/task/add'
import List from '../components/task/list'
import MyList from '../components/task/list/my'

const taskRoutes = {
    path: 'task',
    childRoutes: [{
        path: 'add/:id',
        component: Add
    }, {
        path: 'list',
        component: List
    }, {
        path: 'mine',
        component: MyList        
    }]
}

export default taskRoutes