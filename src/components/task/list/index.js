import React, { Component } from 'react'
import { Table, message, Button } from 'antd'
import { info, list, receive } from '../../../services/task'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: false
        }
    }
    
    componentWillMount() {
        this.infoHandler()
    }

    infoHandler = () => {
        this.setState({ loading: true })
        info({ state: 1 }).then((data) => {
            if (data.count === 0) {
                this.setState({ loading: false, total: 0, dataSource: [] })
            } else {
                this.setState({ total: data.count })
                this.listHandler(1)
            }
        })
    }

    listHandler = (offset) => {
        this.setState({ loading: true })
        list({
            offset, limit: 6, state: 1
        }).then((data) => {
            this.setState({ dataSource: data.list,  loading: false })
        }).catch((error) => message.error(error))
    }

    receiveHandler = (id) => {
        receive({ id }).then(() => {
            message.success('任务已接收!')
            this.setState(prevState => ({
                dataSource: prevState.dataSource.filter(i => i.id !== id )
            }))
        }).catch(error => message.error(error))
    }
    render() {
        const { dataSource, total, loading } = this.state
        const columns = [{
            title: '任务标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '任务描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '操作',
            key: 'opreator',
            render: (text, record) => <Button onClick={() => this.receiveHandler(record.id)}>接受任务</Button>
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: this.listHandler
        }
        return (
            <Table columns={columns} dataSource={dataSource} pagination={pagination} loading={loading} />
        )
    }
}

export default List