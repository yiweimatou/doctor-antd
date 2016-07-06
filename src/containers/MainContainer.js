import { connect } from 'react-redux'
import Main from '../components/Main.js'

const mapStateToProps = state=>({
    auth:state.auth
})

const mapDispatchToProps = dispatch =>({
    login({mobile,password}){
        dispatch({
            type:'login/start',
            payload:{
                mobile,password
            }
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(Main)
