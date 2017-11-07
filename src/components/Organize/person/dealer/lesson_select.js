import React, { Component, PropTypes } from 'react'
import { message, Table, Modal } from 'antd'
import { getLessonListByUserId } from '../../../../services/lesson'

class LessonSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataSource: [],
            total: 0,
        }
    }
    
    componentWillMount() {
        this.listHandler()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.id !== this.props.id) {
            this.listHandler(1, nextProps.id)
        }
    }
    
    
    listHandler = (offset, id = this.props.id) => {
        getLessonListByUserId({ userId: id, limit: 6, offset }, (error, dataSource, total) => {
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
            onChange: this.listHandler
        }
        const rowSelection = {
            type: 'radio',
            onSelect: (record) => this.props.onSelect(record)
        }
        return (
            <Modal
                title="更改课程"
                footer={null}
                maskClosable={false}
                onCancel={this.props.onCancel}
                visible={this.props.visible}
            >
                <Table 
                    rowKey="id" 
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={pagination}
                    rowSelection={rowSelection}
                />
            </Modal>
        )
    }
}

LessonSelect.propTypes = {
    id: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
}

export default LessonSelect