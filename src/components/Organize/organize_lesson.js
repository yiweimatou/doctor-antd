import React, { Component } from 'react'
import { Tabs, Table, Button, Modal, message, Input, Col } from 'antd'
import { connect } from 'react-redux'
import { asyncInfo, list, getOrganizeLessonInfo, editOrganizeLesson } from '../../services/organizeLesson'
import LessonSelect from './lesson_select'
import OrganizeBar from './organize_bar'

const TabPane = Tabs.TabPane
class OrganizeLesson extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            title: '',
            mobile: '',
            cname: '',
            cet_cname: '',
            total: 0,
            state: 1,
            dataSource: [],
            loading: true,
            dataSource2: [],
            loading2: true,
            total2: 0
        }
    }

    componentWillMount() {
        this.infoHandler()
        this.infoHandler2()
    }

    infoHandler = () => {
        const id = this.props.params.id
        const { state, cname, cet_cname, mobile, title } = this.state
        asyncInfo({ organize_id: id, state, cname, cet_cname, mobile, title }, (error, count) => {
            if (error) {
                this.setState({ loading: false })
                message.error(error)
            } else {
                if (count === 0) {
                    this.setState({ loading: false, total: 0, dataSource: [] })
                } else {
                    this.setState({ total: count })
                    this.changeHandler(1)
                }
            }
        })
    }

    edit = (id, state) => {
        editOrganizeLesson({ id, state }).then(() => {
            message.success('操作成功!')
        }).catch(error => message.error(error))
    }

    changeHandler = offset => {
        const id = this.props.params.id
        const { title, state, cname, cet_cname, mobile } = this.state
        list({
            organize_id: id, title, offset, limit: 6, state, cname, cet_cname, mobile
        }, (error, dataSource) => {
            if (error) {
                message.error(error)
                this.setState({ loading: false })
            } else {
                this.setState({ loading: false, dataSource })
            }
        })
    }

    infoHandler2 = () => {
        const organize_id = this.props.params.id
        getOrganizeLessonInfo({ organize_id , state: 2 })
        .then(data => {
            if (data.count === 0) {
                this.setState({
                    loading2: false,
                    total2: 0,
                    dataSource2: []
                })
            } else {
                this.setState({ total2: data.count })
                this.changeHandler2(1)
            }
        })
    }

    changeHandler2 = offset => {
        const { title, cname, cet_cname, mobile } = this.state
        list({
            organize_id: this.props.params.id, offset, limit: 6, state: 2, title, cname, cet_cname, mobile
        }, (error, dataSource2) => {
            if (error) {
                this.setState({ loading2: false })
                message.error(error)
            } else {
                this.setState({ loading2: false, dataSource2 })
            }
        })
    }
    
    toggleVisible = () => this.setState({ visible: !this.state.visible })
    render() {
        const { 
            dataSource, loading, total, visible, title, cet_cname, cname, mobile,
            dataSource2, loading2, total2
        } = this.state
        const columns = [{
            title: '课程名称',
            key: 'title',
            dataIndex: 'title'
        }, {
            title: '主讲',
            key: 'admin',
            dataIndex: 'admin'
        }, {
            title: '有效时间',
            key: 'start_ms',
            render: (text, record) => `${(new Date(record.start_ms * 1000)).toLocaleString()}至${(new Date(record.expires_ms * 1000)).toLocaleString()}`
        }]

        const columns2 = [{
            title: '课程名称',
            key: 'title',
            dataIndex: 'title'
        }, {
            title: '主讲',
            key: 'admin',
            dataIndex: 'admin'
        }, {
            title: '认购费用',
            key: 'organize_amount',
            dataIndex: 'organize_amount',
            render: text => `${text / 100}元\/年`
        }, {
            title: '',
            key: 'buy_state',
            dataIndex: 'buy_state',
            render: (text, record) => {
                if (text === 2) {
                    return (<div>
                                <Button onClick={() => this.edit(record.ol_id, 3)}>拒绝</Button>
                                <Button onClick={() => this.edit(record.ol_id, 1)} type="primary" style={{ marginLeft: '10px' }}>通过认证</Button>
                            </div>)
                } else if (text === 3) {
                    return ('已拒绝')
                } else {
                    return ('')
                }
            }
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            onChange: this.changeHandler,
            pageSize: 6
        }

        const pagination2 = {
            total: total2,
            showTotal: total => `共${total}条`,
            onChange: this.changeHandler2,
            pageSize: 6
        }

        return (
            <div>
                <Modal width={720} visible ={visible} title="认购课程" onOk={this.toggleVisible} onCancel={this.toggleVisible} maskClosable={false}>
                    <LessonSelect organize_id={this.props.params.id}/>
                </Modal>
                <OrganizeBar selectedKey="lesson" organize={this.props.organize}/>
                <div>
                    <Input.Group style={{ marginBottom: '20px' }}>
                    <Col span={5}>
                        <Input placeholder="课程标题" value={title} onChange={e => this.setState({ title: e.target.value })}/>
                    </Col>
                    <Col span={5}>
                        <Input placeholder="主讲姓名" value={cet_cname} onChange={e => this.setState({ cet_cname: e.target.value })} />
                    </Col>
                    <Col span={5}>
                        <Input placeholder="主讲昵称" value={cname} onChange={e => this.setState({ cname: e.target.value })} />
                    </Col>
                    <Col span={5}>
                        <Input placeholder="主讲手机号码" value={mobile} onChange={e => this.setState({ mobile: e.target.value })} />
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={this.infoHandler}>搜索</Button>
                        <Button type="ghost" style={{ marginLeft: '10px' }} onClick={() => this.setState({ visible: true })}>认购课程</Button>             
                    </Col>
                </Input.Group>
                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="机构课程" key="1">
                        <Table dataSource={dataSource} loading={loading} columns={columns} pagination={pagination} />
                    </TabPane>
                    <TabPane tab="未认证课程" key="2">
                        <Table dataSource={dataSource2} loading={loading2} columns={columns2} pagination={pagination2}/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default connect(
    state => ({
        organize: state.organize.entity
    })
)(OrganizeLesson)