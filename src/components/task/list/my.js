import React, { Component } from 'react'
import { Tabs, Table, message, Button } from 'antd'
import { info, list, submit } from '../../../services/task'

const TabPane = Tabs.TabPane
class MyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list1: [],
            list2: [],
            total1: 0,
            total2: 0,
            loading1: false,
            loading2: false,
        }
    }
    
    componentWillMount() {
        this.userId = JSON.parse(localStorage.auth).key
        this.infoHandler({
            send_account_id: this.userId
        })
        this.infoHandler({
            receive_account_id: this.userId
        })
    }
    
    infoHandler = (params) => {
        if (params.send_account_id > 0) {
            this.setState({ loading1: true })
            info(params).then((data) => {
                if (data.count ===0) {      
                    this.setState({
                        total1: 0,
                        list1: [],
                        loading1: false
                    })
                } else {
                    this.changeHandler({ offset: 1, limit: 6, ...params })
                }
            }).catch(error => {
                this.setState({ loading1: false })
                message.error(error)
            })
        } else {
            this.setState({ loading2: true })
            info(params).then((data) => {
                if (data.count ===0) {      
                    this.setState({
                        total2: 0,
                        list2: [],
                        loading2: false
                    })
                } else {
                    this.changeHandler({ offset: 1, limit: 6, ...params })
                }
            }).catch(error => {
                this.setState({ loading2: false })
                message.error(error)
            })
        }
    }

    changeHandler = (params) => {
        if (params.send_account_id > 0) {
            this.setState({ loading1: true })
            list(params).then((data) => {
                this.setState({ list1: data.list, loading1: false })
            }).catch(error => {
                message.error(error)
                this.setState({ loading1: false })
            })
        } else {
            this.setState({ loading2: true })
            list(params).then((data) => {
                this.setState({ list2: data.list, loading2: false })
            }).catch(error => {
                message.error(error)
                this.setState({ loading2: false })
            })
        }
    }
    submitHandler = (id) => {
        submit({ id }).then(() => {
            message.success('提交成功!')
            this.setState(prevState => ({
                list2: prevState.list2.map(i => {
                    if (i.id === id) {
                        return {
                            ...i,
                            state: 3
                        }
                    }
                    return i
                })
            }))
        }).catch(error => message.error(error))
    }
    render() {
        const { list1, list2, loading1, loading2, total1, total2 } = this.state
        const columns1 = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 && '待接任务' || text === 2 && '任务中' || text === 3 && '任务完成'
        }]
        const columns2 = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 && '待接任务' || text === 2 && '任务中' || text === 3 && '任务完成'
        }, {
            title: '操作',
            key: 'opreator',
            render: (text, record) => record.state ===2 && <Button onClick={() => this.submitHandler(record.id)}>完成任务</Button>
        }]
        const pagination1 = {
            total: total1,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: (offset) => this.changeHandler({ offset, limit:6, send_account_id: this.userId })
        }
        const pagination2 = {
            total: total2,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: (offset) => this.changeHandler({ offset, limit:6, receive_account_id: this.userId })
        }
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="我接收的任务" key="1">
                    <Table dataSource={list2} columns={columns2} loading={loading2} pagination={pagination2} />
                </TabPane>
                <TabPane tab="我发布的任务" key="2">
                    <Table dataSource={list1} columns={columns1} loading={loading1} pagination={pagination1} />
                </TabPane>
            </Tabs>
        )
    }
}

export default MyList