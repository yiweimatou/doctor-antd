import React, { Component } from 'react'
import Add from '../add'
import List from '../list'
import { info, list } from '../../../services/h5'
import { message } from 'antd' 
import Help from '../../help'

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
        this.editHandler = this.editHandler.bind(this)
        this.delHandler = this.delHandler.bind(this)
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
            state: 1,
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
    editHandler(record) {
        this.setState((prevState) => ({
            list: prevState.list.map(item => {
                if (item.id === record.id) {
                    return record
                }
                return item
            })
        }))
    }
    delHandler(id) {
        this.setState((prevState) => ({
            list: prevState.list.filter(item => item.id !== id),
            total: prevState.total - 1
        }))
    }
    render() {
        const { list, total, loading } = this.state
        return (
            <div>
                <Help help_id={17} />
                <div style={{ marginBottom: 10 }}>
                    <Add okHandler={this.okHandler}/>
                </div>
                <List
                    dataSource={list}
                    loading={loading}
                    total={total}
                    editHandler={this.editHandler}
                    delHandler={this.delHandler}
                    onChange={this.changeHandler}
                />
            </div>
        )
    }
}

export default Manage