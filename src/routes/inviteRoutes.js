import Manage from '../components/Invite/Manage'

const manage = store => ({
    path: 'manage',
    component:Manage,
    onEnter(){
        const account_id = store.getState().auth.key
        store.dispatch({
            type: 'lessonTeam/info',
            payload: {
                account_id,
                cet: 1
            }
        })
        store.dispatch({
            type:'lessonTeam/list',
            payload:{
                account_id,
                cet: 1,
                offset: 1,
                limit: 6
            }
        })
    }
})

const inviteRoutes = store => ({
    path: 'invite',
    childRoutes: [
        manage(store)
    ]
})

export default inviteRoutes