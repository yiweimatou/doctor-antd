import React, { Component } from 'react'
import { Table, message } from 'antd'
import { getLessonListByUserId } from '../../services/lesson'
import { connect } from 'react-redux'

class LessonSelect extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: true
        }
    }

    componentWillMount() {
        this.changeHandler(1)
    }
    
    changeHandler = (offset) => {
        getLessonListByUserId({ userId: this.props.userId, limit: 6, offset }, (error, dataSource, total) => {
            if (error) {
                this.setState({ loading: false })
                message.error(error)
            } else {
                if (offset === 1 ) {
                    this.setState({ dataSource, total, loading: false })
                } else {
                    this.setState({ dataSource, loading: false })
                }
            }
        })
    }

    render() {
        const { loading, total, dataSource } = this.state
        const columns = [{
            title: '课程标题',
            dataIndex: 'title',
            key: 'title'
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: this.changeHandler
        }
        const rowSelection = {
            type: 'radio',
            onSelect: (record) => this.props.onChange(record)
        }
        return (
            <Table rowKey="id" columns={columns} loading={loading} dataSource={dataSource} pagination={pagination} rowSelection={rowSelection}/>
        )
    }
}

export default connect(
    state => ({
        userId: state.auth.key
    })
)(LessonSelect)