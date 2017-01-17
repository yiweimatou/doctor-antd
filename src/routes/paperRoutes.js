import List from '../components/Paper/List'

const listRoute = () => ({
    path: 'list',
    component: List,
    onEnter: (nextState, replace) => {
        const id = nextState.location.query.id
        if (!id) {
            return replace({ pathname: '/' })
        }
        // store.dispatch({
        //     type: 'paper/info',
        //     payload: {
        //         params: { section_id: id }
        //     }
        // })
        // store.dispatch({
        //     type: 'paper/list',
        //     payload: {
        //         params: { section_id: id, offset: 1, limit: 9 }
        //     }
        // })
    }
})

const paperRoutes = store => ({
    path: 'paper',
    childRoutes: [
        listRoute(store)
    ]
})

export default paperRoutes
