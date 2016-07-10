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
        lid:state.lesson.entity.lid
    }
}

function mapDispatchToProps(dispatch) {
    return{
        onChange(page,limit,oname){
            dispatch({
                type:'organize/info',
                payload:{
                    oname
                }
            })
            dispatch({
                type:'organize/list',
                payload:{
                    offset:page,
                    limit:limit,
                    oname:oname
                }   
            })
        },
        apply(oid,lid){
            dispatch({
                type:'organizeLesson/new',
                payload:{
                    oid,
                    lid
                }
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectOrganize)