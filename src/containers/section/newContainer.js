import { connect } from 'react-redux'
import New from '../../components/Section/New.js'

function mapStateToProps(state) {
    return {
        list:state.section.entity
    }
}

export default connect(mapStateToProps)(New)