import { connect } from 'react-redux'
import List from '../../components/Lesson/Tlist'

const mapStateToProps = state => ({
    list:{
        data:state.lessonTeam.list.filter(item=>item.type<3)
    }
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