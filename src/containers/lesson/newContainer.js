import { connect } from 'react-redux'
import New from '../../components/Lesson/New.js'

const dispatchToProps = dispatch => ({
    newLesson(params){
        dispatch({
            type:'lesson/new',
            payload:params
        })
    }
})

export default connect(null,dispatchToProps)(New)
