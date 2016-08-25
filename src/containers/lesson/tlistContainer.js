import { connect } from 'react-redux'
import List from '../../components/Lesson/Tlist'

const mapStateToProps = state => ({
    list:{
        data:state.lessonTeam.list.filter(item=>item.type<3),
    }
})

export default connect(mapStateToProps)(List)