import { connect } from 'react-redux'
import Main from '../components/Main.js'
import authSelector from '../selectors/auth'

const mapStateToProps = state=>({
    auth:authSelector(state)
})

const mapDispatchToProps = dispatch =>({
    login({mobile,password}){
        dispatch({
            type:'login/start',
            payload:{
                mobile,password
            }
        })
    },
    logout(){
        dispatch({
            type:'logout'
        })
    }
})

export default connect( mapStateToProps,mapDispatchToProps )(Main)

