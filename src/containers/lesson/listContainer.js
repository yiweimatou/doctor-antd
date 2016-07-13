import { connect } from 'react-redux'
import List from '../../components/Lesson/List.js'

const mapStateToProps = state => ({
    list:state.lesson.list,
    uid:state.auth.key
})

const mapDispatchToProps = dispatch => ({
    changeHandler(offset,uid,pageParam){
        dispatch({
            type:'lesson/list',
            payload:{
                ...pageParam,
                offset,
                uid
            }
        })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(List)