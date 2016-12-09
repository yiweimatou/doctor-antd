import React, { Component } from 'react'
import { Table, Button, message } from 'antd'
import { info, list } from '../../../services/h5'

class H5Select extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            total: 0
        }
    }
    
    componentWillMount() {
        this.infoHandler()
    }
    
    infoHandler = () => {
        info({ account_id: JSON.parse(localStorage.auth).key, state: 1 }).then(data => {
            if (data.count ===0) {
                this.setState({ total: 0, dataSource: [] })    
            } else {
                this.setState({ total: data.count })
                this.listHandler(1)
            }
        })
    }
    listHandler = offset => {
        this.setState({ loading: true })
        list({ state: 1, offset, limit: 6, account_id: JSON.parse(localStorage.auth).key }).then((data) => {
            this.setState({ dataSource: data.list, loading: false })
        }).catch(error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    render() {
        const { loading, dataSource, total } = this.state
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '操作',
            key: 'opreator',
            render: (text, record) => <Button onClick={() => this.props.clickHandler(record)}>引用</Button>
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            onChange: this.listHandler
        }
        return (
            <Table loading={loading} dataSource={dataSource} columns={columns} pagination={pagination}/>
        )
    }
}

export default H5Select
