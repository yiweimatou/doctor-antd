import Manage from '../components/Question/Manage';


const manageRoute = store => ({
    path: 'manage',
    component: Manage,
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
    childRoutes: [manageRoute(store)]
})

export default questionRoutes