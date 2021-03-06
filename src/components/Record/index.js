import React, { Component } from 'react'
import { Table, Button, message, Popconfirm } from 'antd'
import { Link } from 'react-router'
import record from '../../services/record'
import Add from './add'
import Edit from './edit'
import AddShare from './share/add'
import { displayage } from '../../utils'
import Help from '../help'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            total: 0,
            addVisible: false,
            editVisible: false,
            shareVisible: false,
            item: {}
        }
        this.addVisibleToggle = this.addVisibleToggle.bind(this)
        this.editHandler = this.editHandler.bind(this)
        this.editVisibleToggle = this.editVisibleToggle.bind(this)
        this.addHandler = this.addHandler.bind(this)
        this.editClickHandler = this.editClickHandler.bind(this)
        this.removeHandler = this.removeHandler.bind(this)
        this.shareVisibleToggle = this.shareVisibleToggle.bind(this)
    }

    componentWillMount() {
        const userId = JSON.parse(localStorage['auth']).key
        this.infoHandler({ account_id: userId })
    }

    infoHandler = (params) => {
        record.info(params).then(data => {
            if (data.count === 0) {
                this.setState({
                    dataSource: [],
                    total: 0
                })
            } else {
                this.setState({ total: data.count })
                this.listHandler({ limit: 6, offset: 1, ...params })
            }
        })
    }

    listHandler = (params) => {
        this.setState({ loading: true })
        record.list(params).then(data => {
            this.setState({
                dataSource: data.list,
                loading: false
            })
        }).catch(error => {
            this.setState({ loading: false })
            message.error(error)
        })
    }

    shareVisibleToggle() {
        this.setState(prevState => ({ shareVisible: !prevState.shareVisible }))
    }

    shareClickHandler = item => {
        this.setState({ item, shareVisible: true })
    }

    addVisibleToggle() {
        this.setState(prevState => ({ addVisible: !prevState.addVisible }))
    }

    editVisibleToggle() {
        this.setState(prevState => ({ editVisible: !prevState.editVisible }))
    }

    addHandler(record) {
        this.setState(prevState => ({
            dataSource: [record].concat(prevState.dataSource),
            total: prevState.total + 1,
            addVisible: false
        }))
    }

    editHandler(record) {
        this.setState(prevState => ({
            dataSource: prevState.dataSource.map(i => {
                if (i.id === record.id) return record
                return i
            }),
            editVisible: false
        }))
    }

    editClickHandler(rcd) {
        this.setState({
            item: rcd,
            editVisible: true
        })
    }

    removeHandler(id) {
        record.remove({ id }).then(() => {
            this.setState(prevState => ({
                dataSource: prevState.dataSource.filter(i => id !== i.id),
                total: prevState.total - 1
            }))
            message.error('已删除!')
        }).catch(error => message.error(error))
    }
    render() {
        const { loading, dataSource, total, addVisible, editVisible, item, shareVisible } = this.state
        const columns = [{
            title: '姓名',
            dataIndex: 'cname',
            key: 'cname'
        }, {
            title: '手机号',
            dataIndex: 'mobile',
            key: 'mobile'
        }, {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
            render: text =>
                text === 1 && '保密'
                ||
                text === 2 && '男'
                ||
                text === 3 && '女'
        }, {
            title: '年龄',
            key: 'birthday',
            dataIndex: 'birthday',
            render: text => {
                const arr = new Date(text * 1000)
                return displayage(arr.getFullYear(), arr.getMonth(), arr.getDate())
            }
        }, {
            title: '主要健康问题',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '操作',
            key: 'oper',
            render: (text, rcd) => (
                <div>
                    <Button style={{ marginRight: 10 }} onClick={() => this.editClickHandler(rcd)}>修改</Button>
                    {
                        rcd.share === 2 && <Popconfirm title="确定删除？" onConfirm={() => this.removeHandler(rcd.id)}>
                            <Button>删除</Button>
                        </Popconfirm>
                    }
                    <Button style={{ marginLeft: 10 }} onClick={() => this.shareClickHandler(rcd)}>分享</Button>
                    <Button style={{ marginLeft: 10 }}>
                        <Link to={`/record/${rcd.id}`}>查看档案记录</Link>
                    </Button>
                </div>
            )
        }]
        const pagination = {
            total,
            showTotal: num => `共${num}条`,
            pageSize: 6,
            onChange: offset => this.listHandler({ offset, limit: 6, account_id: JSON.parse(localStorage['auth']).key })
        }
        return (
            <div>
                <Add visible={addVisible} onOk={this.addHandler} onCancel={this.addVisibleToggle}/>
                <Edit visible={editVisible} item={item} onOk={this.editHandler} onCancel={this.editVisibleToggle}/>
                <AddShare visible={shareVisible} item={item} onCancel={this.shareVisibleToggle} />
                <Button type='primary' onClick={this.addVisibleToggle} style={{ marginBottom: 20 }}>添加档案</Button>
                <Table
                    rowKey='id'
                    bordered
                    dataSource={dataSource}
                    loading={loading}
                    columns={columns}
                    pagination={pagination}
                />
                <Help help_id={21} />
            </div>
        )
    }
}

export default List
