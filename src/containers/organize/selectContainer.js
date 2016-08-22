import { connect } from 'react-redux'
import SelectOrganize from '../../components/Organize/SelectOrganize.js'

function mapStateToProps(state) {
    return{
        list:state.organize.list,
        pageParams:{
            offset:state.organize.offset,
            total:state.organize.total,
            limit:state.organize.limit
        },
        lid:state.lesson.entity.id
    }
}

function mapDispatchToProps(dispatch) {
    return{
        onChange(page,limit,title){
            dispatch({
                type:'organize/info',
                payload:{
                    title
                }
            })
            dispatch({
                type:'organize/list',
                payload:{
                    offset:page,
                    limit:limit,
                    title:title
                }   
            })
        },
        apply(organize_id,lesson_id){
            dispatch({
                type:'organizeLesson/new',
                payload:{
                    organize_id,
                    lesson_id
                }
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectOrganize)