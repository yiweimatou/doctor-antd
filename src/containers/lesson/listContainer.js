import { connect } from 'react-redux'
import List from '../../components/Lesson/List.js'

const mapStateToProps = state => ({
    list: state.lesson.list,
    userId: state.auth.key
})

const mapDispatchToProps = dispatch => ({
    changeHandler(params, resolve, reject) {
        dispatch({
            type: 'lesson/list',
            payload: {
              params, resolve, reject
            }
        })
    },
    getLessonInfo(params, resolve, reject) {
      dispatch({
        type: 'lessonteam/info',
        payload: {
          params, resolve, reject
        }
      })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(List)
