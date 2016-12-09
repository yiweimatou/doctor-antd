import React, { Component } from 'react'
import { Table, Input, Col, Select, Button, Menu, Dropdown, Icon, message, Modal } from 'antd'
import { info, list, add, remove } from '../../../services/link'
import { loadJS } from '../../../utils'
import Edit from './edit'

const Group = Input.Group
const Option = Select.Option
class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: '在职',
            total: 0,
            dataSource: [],
            loading: false,
            state: 0,
            type2: '',
            cname: '',
            mobile: '',
            resultTotal: 0,
            resultSTotal: 0,
            record: {}
        }
    }
    
    componentWillMount() {
        if (!window.XLSX) {
            loadJS('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.core.min.js')
        }
        this.infoHandler()
    }
    
    infoHandler = () => {
        const { type2, cname, mobile, state } = this.state
        info({
            type: type2, cname, mobile, state, organize_id: this.props.params.id
         }).then((data) => {
             if (data.count === 0) {
                 this.setState({ total: 0, dataSource: [] })
             } else {
                 this.setState({ total: data.count })
                 this.changeHandler(1)
             }
         }).catch(error => message.error(error))
    }
    changeHandler = offset => {
        const { type2, cname, mobile, state } = this.state
        this.setState({ loading: true })
        list({
            type: type2, cname, mobile, state, offset, limit: 6, organize_id: this.props.params.id
        }).then((data) => {
            this.setState({ dataSource: data.list, loading: false })
        }).catch(error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    fileChangeHandler = e => {
        e.preventDefault()
        this.setState({ loading: true })
        const files  = e.target.files
        const ext = files[0].name.split('.').slice(-1)[0].toUpperCase()
        if (ext !== 'XLS' && ext !== 'XLSX') {
            this.setState({ loading: false })
            return message.error('请上传EXCLE', 8)
        }
        let reader = new FileReader()
        reader.onerror = () => {
            message.error('文件读取错误!', 6)
        }
        reader.onload = e => {
            const data = e.target.result
            if (!window.XLSX) {
                return message.error('缺少组件，请刷新页面!', 8)
            }
            const workbook = window.XLSX.read(data, {type: 'binary'})
            const first_sheet_name = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[first_sheet_name]
            const _json = window.XLSX.utils.sheet_to_json(worksheet)
            this.setState({ resultTotal: _json.length, resultSTotal: 0 })
            this.upload(_json)
        }
        reader.readAsBinaryString(files[0])
    }
    upload = data => {
        if (data.length === 0) return
        Promise.all(data.map(item => {
            add({
                type: this.state.type,
                organize_id: this.props.params.id,
                mobile: item['手机号'],
                cname: item['姓名'],
                dept: item['科室'],
                rank: item['职称']
            }).then(() => this.setState(prveState => ({ resultSTotal: prveState.resultSTotal + 1 })))
        })).then(() => {
            this.infoHandler()
            Modal.info({
                title: '上传结果',
                content: <div>共{this.state.resultTotal}条， 成功{this.state.resultSTotal}</div>
            })
        })
    }
    clickHandler = () => {
      document.getElementById('file').click()
    }
    removeHandler = id => {
        remove({ id }).then(() => {
            message.success('删除成功!')
            this.setState(prveState => ({
                dataSource: prveState.dataSource.filter(i => i.id !== id),
                total: prveState.total - 1
            }))
        }).catch(error => message.error(error))
    }
    okHandler = record => {
        this.setState(prveState => ({
            dataSource: prveState.dataSource.map(i => {
                if (i.id === record.id) {
                    return record
                }
                return i
            }),
            visible: false
        }))
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1"><a onClick={() => {
                    this.setState({type: '在职' })
                    this.clickHandler()
                }}>在职</a></Menu.Item>
                <Menu.Item key="2"><a onClick={() => {
                    this.setState({type: '聘用' })
                    this.clickHandler()
                }}>聘用</a></Menu.Item>
                <Menu.Item key="3"><a onClick={() => {
                    this.setState({type: '校友' })
                    this.clickHandler()
                }}>校友</a></Menu.Item>
            </Menu>
        )
        const { total, dataSource, loading, cname, mobile, visible, record } = this.state
        const columns = [{
            title: '人员姓名',
            dataIndex: 'cname',
            key: 'cname'
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile'
        }, {
            title: '科室',
            dataIndex: 'dept',
            key: 'dept'
        }, {
            title: '职称',
            dataIndex: 'rank',
            key: 'rank'
        }, {
            title: '分类',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 && '已加入' || text === 2 && '未加入'
        }, {
            title: '操作',
            key: 'opreator',
            render: (text, record) => <div>
                                        <Button onClick={() => this.removeHandler(record.id)}>删除</Button>
                                        <Button style={{ marginLeft: 10 }} onClick={() => this.setState({ visible: true, record })}>编辑</Button>
                                      </div>
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            onChange: this.changeHandler,
            pageSize: 6
        }
        return (
            <div>
                <Input id="file" accept="xls,xlsx" onChange={this.fileChangeHandler} type="file" style={{ display: 'none' }}/>
                <Edit visible={visible} record={record} onOk={this.okHandler} onCancel={() => this.setState({ visible: false })}/>
                <Group>
                    <Col span={4}>
                        <Input placeholder="姓名" value={cname} onChange={e => this.setState({ cname: e.target.value })} />
                    </Col>
                    <Col span={4}>
                        <Input placeholder="手机号" value={mobile} onChange={e => this.setState({ mobile: e.target.value })} />
                    </Col>
                    <Col span={8}>
                        人员类型: 
                        <Select style={{ margin: '0 10px', width: '70px' }} defaultValue="" onSelect={val => this.setState({ type2: val })}>
                            <Option value="">全部</Option>
                            <Option value="在职">在职</Option>
                            <Option value="聘用">聘用</Option>
                            <Option value="校友">校友</Option>
                        </Select>
                        状态: 
                        <Select style={{ margin: '0 10px', width: '70px' }} defaultValue="null" onSelect={val => this.setState({ state: val })}>
                            <Option value="null">全部</Option>
                            <Option value="1">已加入</Option>
                            <Option value="2">未加入</Option>
                        </Select>
                        <Button type="primary" onClick={this.infoHandler}>搜索</Button>                        
                    </Col>
                    <Col span={8}>
                        <a style={{ marginRight: 10 }} target="_blank" href="http://7xp3s1.com1.z0.glb.clouddn.com/%E6%A8%A1%E6%9D%BF.xlsx">下载Excel模板</a>
                        <Dropdown overlay={menu}>
                            <Button type="ghost" style={{ marginLeft: 8 }}>
                                导入医生 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </Col>
                </Group>
                <Table bordered bodyStyle={{ marginTop: 20 }} dataSource={dataSource} loading={loading} columns={columns} pagination={pagination} />
            </div>
        )
    }
}

export default List