import React, { Component } from 'react'
import { Table, Button, message, Input, Col } from 'antd'
import { asyncInfo, asyncList } from '../../services/lesson'
import { buy } from '../../services/organizeLesson'

class LessonSelect extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            dataSource: [],
            loading: true,
            total: 0,
            title: '',
            mobile: '',
            cname: '',
            cet_cname: ''
        }
    }
    
    componentWillMount() {
        this.infoHandler()
    }

    infoHandler = () => {
        const { title, cname, cet_cname, mobile } = this.state
        asyncInfo({ title, cname, cet_cname, mobile }, (error, count) => {
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

    changeHandler = offset => {
        const { title, mobile, cname, cet_cname } = this.state
        asyncList({
            title, mobile, offset, limit: 6, cname, cet_cname
        },(error, dataSource) => {
            if (error) {
                message.error(error)
                this.setState({ loading: false })
            } else {
                this.setState({ dataSource, loading: false })
            }
        })
    }

    clickHandler = lesson_id => {
        const { organize_id } = this.props
        this.setState({ loading: true })
        buy({ lesson_id, organize_id }).then(() => {
            message.success('购买成功!')
            this.setState({ loading: false })
        }).catch(error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    render() {
        const { total, dataSource, loading, title, cname, mobile, cet_cname } = this.state
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: this.changeHandler
        }
        const columns = [{
            title: '课程标题',
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
            title: '操作',
            key: 'operate',
            render: (text, record) => <Button type="primary" onClick={() => this.clickHandler(record.id)}>认购</Button>
        }]
        return (
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
                    </Col>
                </Input.Group>
                <Table bordered rowKey="id" columns={columns} pagination={pagination} dataSource={dataSource} loading={loading} />
            </div>
        )
    }
}

export default LessonSelect