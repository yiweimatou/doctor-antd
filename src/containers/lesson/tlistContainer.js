import { connect } from 'react-redux'
import List from '../../components/Lesson/List.js'

const mapStateToProps = state => ({
    list:{
        data:state.lessonTeam.list.filter(item=>item.type<3)
    },
    isAdmin:false,
    uid:state.auth.key
})

const mapDispatchToProps = dispatch => ({
    changeHandler(page,pageParam){
        dispatch({
            type:'lessonTeam/list',
            payload:{
                ...pageParam,
                offset:page
            }
        })
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(List)