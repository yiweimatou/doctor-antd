import { connect } from 'react-redux'
import New from '../../components/Lesson/New.js'
import { push } from 'react-router-redux'

const dispatchToProps = dispatch => ({
    newLesson(params, resolve, reject){
        dispatch({
            type:'lesson/new',
            payload:params,
            meta: {
                resolve, reject
            }
        })
    },
    push: path => dispatch(push(path)),
    residue: (userId, resolve, reject) => dispatch({
        type: 'lesson/residue',
        payload: {
            userId
        },
        meta: {
            resolve, reject
        }
    })
})

export default connect( state => ({
    userId: state.auth.key
}), dispatchToProps)(New)
