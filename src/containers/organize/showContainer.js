import { connect } from 'react-redux'
import Show from '../../components/Organize/Show.js'
import { push } from 'react-router-redux'

const mapStateToProps = state =>({
    organize: state.organize.entity,
    userId: state.auth.key
})

const mapDispatchToProps = dispatch => ({
    push: path => {
        dispatch(push(path))
    },
    getInfo: (params, resolve, reject)=>{
        dispatch({
            type:'organize_lesson/info',
            payload:{
                params, resolve, reject
            }
        })
    },
    getOrganizeTeam: (params, resolve, reject) => {
        dispatch({
            type:'organize_team/get',
            payload:{
                params, resolve, reject
            }
        })
    },
    getLessonList: (params, resolve, reject) => {
        dispatch({
            type:'organize_lesson/list',
            payload:{
                params, resolve, reject
            }
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(Show)