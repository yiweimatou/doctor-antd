import { connect } from 'react-redux'
import Show from '../../components/Organize/Show.js'

const mapStateToProps = state =>({
    organize:state.organize.entity
})

export default connect( mapStateToProps )(Show)