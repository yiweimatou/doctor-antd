import Record from '../components/Record'
import Records from '../components/Record/Records'

const recordRoutes = {
    path: 'record',
    indexRoute: { component: Record },
    childRoutes: [{
        path: ':id',
        component: Records
    }]
}

export default recordRoutes