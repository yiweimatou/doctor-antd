import React,{Component,PropTypes} from 'react'
import {Router} from 'react-router'
import {Provider} from 'react-redux'


class AppContainer extends Component{
    static propTypes = {
        history:PropTypes.object.isRequired,
        store:PropTypes.object.isRequired
    }
    render(){
        const {
            store,
            history
        } = this.props
        const routes = require('../routes')(store)
        return(
            <Provider store={store}>
                <Router
                    history = { history }
                    routes  = { routes }
                />
            </Provider>
        )
    }
}

export default AppContainer
