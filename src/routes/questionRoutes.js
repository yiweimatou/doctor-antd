import Add from '../components/Question/Add';

const addRoute = () => ({
    path: 'add',
    component: Add
})

const questionRoutes = () => ({
    path: 'question',
    childRoutes: [addRoute()]
})

export default questionRoutes