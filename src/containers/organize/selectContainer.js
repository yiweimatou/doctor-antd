import { connect } from 'react-redux'
import SelectOrganize from '../../components/Organize/SelectOrganize.js'

function mapStateToProps(state) {
    return{
        list: state.organize.list,
        loading: state.organize.loading
    }
}

function mapDispatchToProps(dispatch) {
    return{
        onChange(params, resolve, reject){
            dispatch({
                type:'organize/list',
                payload:{
                  params, resolve, reject
                }
            })
        },
        fetchInfo(params, resolve, reject) {
            dispatch({
                type: 'organize/info',
                payload: {
                    params, resolve, reject
                }
            })
        },
        apply(params, resolve, reject){
            dispatch({
                type:'organize_lesson/add',
                payload:{
                  params, resolve, reject
                }
            })
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SelectOrganize)
