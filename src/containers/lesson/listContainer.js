import { connect } from 'react-redux'
import List from '../../components/Lesson/List.js'

const mapStateToProps = state => ({
    list:state.lesson.list,
    id:state.auth.key
})

const mapDispatchToProps = dispatch => ({
    changeHandler(offset,id,pageParam){
        dispatch({
            type:'lesson/list',
            payload:{
                ...pageParam,
                offset
            }
        })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(List)