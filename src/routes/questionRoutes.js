import Add from '../components/Question/Add';
import List from '../components/Question/List'

const addRoute = () => ({
    path: 'add',
    component: Add
})

const listRoute = store => ({
    path: 'list',
    component: List,
    onEnter() {
        const account_id = store.getState().auth.key
        store.dispatch({
            type: 'topic/list',
            payload: {
                params: {
                    offset: 1, limit: 9, account_id
                }
            }
        })
        store.dispatch({
            type: 'topic/info',
            payload: {
                params: { account_id, state:1 }
            }
        })
    }
})

const questionRoutes = store => ({
    path: 'question',
    childRoutes: [addRoute(), listRoute(store)]
})

export default questionRoutes