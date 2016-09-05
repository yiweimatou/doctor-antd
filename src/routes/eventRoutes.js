import New from '../components/Event/New'

const eventNewRoute = () => ({
    path: 'new',
    component: New
})

const eventRoutes = () => ({
    path: 'event',
    childRoutes: [
        eventNewRoute()
    ]
})

export default eventRoutes