import {connect} from 'react-redux'
import List from '../../components/Organize/List.js'

const mapStateToProps = state=>({
    loading: state.organize.loading,
    userId: state.auth.key
})

const mapDispatchToProps = dispatch => ({
    changeHandler: (params, resolve, reject)=>{
        dispatch({
            type:'organize_team/list',
            payload:{
                params, resolve, reject
            }
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(List)