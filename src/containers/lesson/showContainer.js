import { connect } from 'react-redux'
import Show from '../../components/Lesson/Show.js'
import {push} from 'react-router-redux'

function mapStateToProps(state){
    return {
        lesson:state.lesson.entity,
        olist:state.organizeLesson.list,
        teamList:state.lessonTeam.list
    }
}

function mapDispatchToProps(dispatch) {
    return {
        push:(path)=>{
            dispatch(push(path))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Show)
