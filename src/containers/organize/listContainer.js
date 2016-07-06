import {connect} from 'react-redux'
import List from '../../components/Organize/List.js'

const mapStateToProps = state=>({
    list:state.organize.list,
    pageParams:{
        limit:state.organize.limit,
        offset:state.organize.offset,
        total:state.organize.total,
        uid:state.auth.key
    }
})

const mapDispatchToProps = dispatch => ({
    changeHandler:(page,uid)=>{
        dispatch({
            type:'organize/list',
            payload:{
                limit:6,
                offset:page,
                uid
            }
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(List)