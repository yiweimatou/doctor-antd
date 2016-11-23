import { connect } from 'react-redux'
import Show from '../../components/Organize/Show.js'

const mapStateToProps = state =>({
    organize: state.organize.entity,
    loading: state.organize.loading
})

const mapDispatchToProps = dispatch => ({
    edit: (params, resolve, reject) => dispatch({
        type: 'organize/edit',
        payload: {
            params, resolve, reject
        }
    })
})

export default connect( mapStateToProps,mapDispatchToProps )(Show)
