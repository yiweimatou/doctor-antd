import { connect } from 'react-redux'
import Show from '../../components/Lesson/Show.js'
import { push } from 'react-router-redux'

function mapStateToProps(state){
    return {
        userId: state.auth.key,
        id: state.routing.locationBeforeTransitions.pathname.split('/')[3],
        lesson: state.lesson.entity
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSectionInfo: (params, resolve, reject) => {
          dispatch({
            type: 'section/info',
            payload: {
              params, resolve, reject
            }
          })
        },
        getLessonTeamList: (params, resolve, reject) => {
          dispatch({
            type: 'lessonteam/list',
            payload: {
              params, resolve, reject
            }
          })
        },
        getOrganizeList: (params, resolve, reject) => {
          dispatch({
            type: 'organize_lesson/list',
            payload: {
              params, resolve, reject
            }
          })
        },
        getLessonTeam: (params, resolve, reject) => {
          dispatch({
            type: 'lessonteam/get',
            payload: {
              params, resolve, reject
            }
          })
        },
        getLesson: (params, resolve, reject) => {
          dispatch({
            type: 'lesson/get',
            payload: params,
            resolve,
            reject
          })
        },
        push: path => {
            dispatch(push(path))
        },
        handleSectionEdit: (params) => {
            dispatch({
                type:'section/edit',
                payload:params
            })
        },
        changeHandler: (offset,limit,lesson_id) => {
            dispatch({
                type:'section/list',
                payload:{
                    offset,limit,lesson_id
                }
            })
        },
        deleteSection:(sid)=>{
            dispatch({
                type:'section/delete',
                payload:{
                    id: sid
                }
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Show)
