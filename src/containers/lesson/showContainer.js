import { connect } from 'react-redux'
import Show from '../../components/Lesson/Show.js'
import {push} from 'react-router-redux'

function mapStateToProps(state){
    const uid = state.auth.key
    //1主讲2团队讲师3普通角色
    let isAdmin=3
    if(state.lesson.entity){
        isAdmin = state.lesson.entity.account_id === uid?1:3
    }
    state.lessonTeam.list.forEach(item=>{
        if((item.type === 1 ||item.type === 2)&&item.account_id===uid){
            isAdmin=2
        }
    })
    return {
        lesson:state.lesson.entity,
        olist:state.organizeLesson.list.data,
        teamList:state.lessonTeam.list,
        isAdmin:isAdmin,
        uid:uid,
        sList:{
            data:state.section.list,
            pageParams:{
                limit:state.section.limit,
                total:state.section.total
            }
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
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
        changeHandler:(offset,limit,lid)=>{
            dispatch({
                type:'section/list',
                payload:{
                    offset,limit,lid
                }
            })
        },
        deleteSection:(sid)=>{
            dispatch({
                type:'section/delete',
                payload:{
                    sid
                }
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Show)
