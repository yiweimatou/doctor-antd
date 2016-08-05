import { connect } from 'react-redux'
import Show from '../../components/Organize/Show.js'
import { push } from 'react-router-redux'

const mapStateToProps = state =>({
    organize:state.organize.entity,
    list:state.organizeLesson.list,
})

const mapDispatchToProps = dispatch => ({
    push:(path)=>{
            dispatch(push(path))
    },
    edit:(agree,id)=>{
        dispatch({
            type:'organizeLesson/edit',
            payload:{
                id,
                cet:agree?4:3
            }
        })
    },
    changeHandler:(offset,limit)=>{
        dispatch({
            type:'organizeLesson/list',
            payload:{
                offset,
                limit
            }
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(Show)