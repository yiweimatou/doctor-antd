import { connect } from 'react-redux'
import Show from '../../components/Organize/Show.js'

const mapStateToProps = state =>({
    organize:state.organize.entity,
    list:state.organizeLesson.list,
    pageParams:{
        limit:state.organizeLesson.limit,
        offset:state.organizeLesson.offset,
        total:state.organizeLesson.total
    }
})

const mapDispatchToProps = dispatch => ({
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