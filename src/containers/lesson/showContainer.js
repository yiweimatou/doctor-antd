import { connect } from 'react-redux'
import Show from '../../components/Lesson/Show.js'
import { push } from 'react-router-redux'

function mapStateToProps(state){
    return {
        olist:state.organizeLesson.list.data,
        teamList:state.lessonTeam.list,
        userId: state.auth.key,
        id: state.routing.locationBeforeTransitions.pathname.split('/')[3]
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLessonTeam: (params, resolve, reject) => {
          dispatch({
            type: 'lessonTeam/get',
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
        push:(path)=>{
            dispatch(push(path))
        },
        handleRemove:(id)=>{
            dispatch({
                type:'lessonTeam/delete',
                payload:{
                    id
                }
            })
        },
        handleSectionEdit:(params)=>{
            dispatch({
                type:'section/edit',
                payload:params
            })
        },
        changeHandler:(offset,limit,lesson_id)=>{
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
