import React, { Component } from 'react'
import { Table, Button, message, Popconfirm } from 'antd'
import records from '../../../services/records'
import Add from './add'
import Edit from './edit'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            total: 0,
            addVisible: false,
            editVisible: false,
            item: {}
        }
        this.infoHandler = this.infoHandler.bind(this)
        this.listHandler = this.listHandler.bind(this)
        this.addVisibleToggle = this.addVisibleToggle.bind(this)
        this.editVisibleToggle = this.editVisibleToggle.bind(this)
        this.addOnOk = this.addOnOk.bind(this)
        this.editOnOk = this.editOnOk.bind(this)
        this.removeHandler = this.removeHandler.bind(this)
        this.editClick = this.editClick.bind(this)
    }

    componentWillMount() {
        this.infoHandler()
    }

    infoHandler() {
        records.info({
            record_id: this.props.params.id,
            state: 1
        }).then((data) => {
            if (data.count === 0) {
                this.setState({ total: 0, dataSource: [] })
            } else {
                this.setState({ total: data.count })
                this.listHandler(1)
            }
        })
    }

    listHandler(offset) {
        this.setState({ loading: true })
        records.listAsync({
            offset, limit: 6, record_id: this.props.params.id, state: 1
        }, (error, result) => {
            if (error) {
                message.error(error)
                this.setState({
                    loading: false,
                    dataSource: []
                })
            } else {
                this.setState({
                    dataSource: result,
                    loading: false
                })
            }
        })
    }

    addVisibleToggle() {
        this.setState(prevState => ({ addVisible: !prevState.addVisible }))
    }

    addOnOk(record) {
        this.setState(prevState => ({
            dataSource: [record].concat(prevState.dataSource),
            total: prevState.total + 1,
            addVisible: false
        }))
    }

    editVisibleToggle() {
        this.setState(prevState => ({ editVisible: !prevState.editVisible }))
    }

    editOnOk(record) {
        this.setState(prevState => ({
            dataSource: prevState.dataSource.map(item => {
                if (item.id === record.id) return record
                return item
            }),
            editVisible: false
        }))
    }

    removeHandler(id) {
        records.remove({ id }).then(() => this.setState(prevState => ({
            dataSource: prevState.dataSource.filter(i => i.id !== id),
            total: prevState.total - 1
        }))).catch(error => message.error(error))
    }

    editClick(record) {
        this.setState({
            editVisible: true,
            item: record
        })
    }

    render() {
        const { loading, dataSource, total, addVisible, editVisible } = this.state
        const columns = [{
            title: '创建时间',
            key: 'add_ms',
            dataIndex: 'add_ms',
            render: text => (new Date(text * 1000)).toLocaleString()
        }, {
            title: '健康描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '健康数据',
            key: 'items',
            render: (text, record) => (
                record.items.map(item => <div key={item.id}>{`${item.title}:${item.val}`}</div>)
            )
        }, {
            title: '饮食/营养',
            dataIndex: 'diet',
            key: 'diet'
        }, {
            title: '运动',
            dataIndex: 'sports',
            key: 'sports'
        }, {
            title: '药物',
            dataIndex: 'drug',
            key: 'drug'
        }, {
            title: '就诊记录',
            dataIndex: 'visit',
            key: 'visit'
        }, {
            title: '图片',
            key: 'imgs',
            render: (text, record) => (
                <div>
                    {record.imgs.map(item => <div key={item.id}><img src={item.path} width="50px" /></div>)}
                </div>
            )
        }, {
            title: '操作',
            key: 'oper',
            render: (text, record) => (
                <div>
                    <Button style={{ marginRight: 10 }} onClick={() => this.editClick(record)}>
                        修改
                    </Button>
                    <Popconfirm title="确定删除？" onConfirm={() => this.removeHandler(record.id)}>
                        <Button>删除</Button>
                    </Popconfirm>
                </div>
            )
        }]
        const pagination = {
            total,
            showTotal: num => `共${num}条`,
            pageSize: 6,
            onChange: this.listHandler
        }
        return (
            <div>
                <Add visible={addVisible} record_id={this.props.params.id} onOk={this.addOnOk} onCancel={this.addVisibleToggle}/>
                <Edit visible={editVisible} record={this.state.item} onOk={this.editOnOk} onCancel={this.editVisibleToggle}/>
                <Button
                    type='primary'
                    style={{ marginBottom: 20 }}
                    onClick={this.addVisibleToggle}
                    >添加健康记录</Button>
                <Table
                    rowKey="id"
                    bordered
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={pagination}
                />
            </div>
        );
    }
}

export default List
