import React, { Component } from 'react'
import Add from '../add'
import List from '../list'
import { info, list } from '../../../services/h5'
import { message } from 'antd' 

class Manage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            total: 0,
            loading: true
        }
        this.okHandler = this.okHandler.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }
    
    componentWillMount() {
        const userId = JSON.parse(localStorage['auth']).key
        info({
            account_id: userId,
            state: 1
        }).then(data => {
            if (data.count === 0){
                this.setState({ total: 0, loading: false })
            } else {
                this.setState({ total: data.count })
                this.changeHandler(1)
            }
        })
        .catch(error => message.error(error))
    }
    
    okHandler(record) {
        this.setState(function (prevState){
           return ({
               list: [record].concat(prevState.list),
               total: prevState.total + 1
           })
        })
    }
    changeHandler(offset) {
        list({
            account_id: JSON.parse(localStorage['auth']).key,
            offset, limit: 6
        }).then(data => {
            this.setState({
                list: data.list,
                loading: false
            })
        }).catch(error => {
            this.setState({
                loading: false
            })
            message.error(error)
        })
    }
    render() {
        const { list, total, loading } = this.state
        return (
            <div>
                <div style={{ marginBottom: 10 }}>
                    <Add okHandler={this.okHandler}/>
                </div>
                <List dataSource={list} loading={loading} total={total} />
            </div>
        )
    }
}

export default Manage