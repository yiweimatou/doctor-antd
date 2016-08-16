import Message from '../components/Message'

const indexRoutes = store => ({
    path: 'index',
    components: Message,
    onEnter() {
        const uid = store.getState().auth.key
        store.dispatch({
            type: 'message/fetchinfo',
            payload: {
                account_id: uid
            }
        })
        store.dispatch({
            type: 'message/fetchlist',
            payload: {
                account_id: uid,
                limit: 6,
                offset: 1
            }
        })
    }
})

const messageRoutes = store => ({
    path: 'message',
    childRoutes : [
        indexRoutes(store)
    ]
})

export default messageRoutes