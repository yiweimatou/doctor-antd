import { connect } from 'react-redux'
import New from '../../components/Lesson/New.js'
import loadingSelector from '../../selectors/lesson'
const dispatchToProps = dispatch => ({
    newLesson(params){
        dispatch({
            type:'lesson/new',
            payload:params
        })
    }
})

export default connect(state => ({
    loading:loadingSelector(state)
}),dispatchToProps)(New)
