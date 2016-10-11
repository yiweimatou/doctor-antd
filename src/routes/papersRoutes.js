import List from '../components/Papers/List'

const listRoutes = store => ({
    path: 'list',
    component: List,
    onEnter(nextState, replace) {
        const id = nextState.location.query.id
        if (!id) {
            return replace({ pathname: '/' })
        }
        store.dispath({
            type: 'papers/list',
            payload: {
                params: { id }
            }
        })
    }
})

const papersRoutes = store => ({
    path: 'papers',
    childRoutes: [
        listRoutes(store)
    ]
})

export default papersRoutes