import React, { Component } from 'react'
import { Table } from 'antd'

class List extends Component {
    render() {
        const { dataSource, total, loading, onChange } = this.props
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '出售金额',
            dataIndex: 'sale_amount',
            key: 'sale_amount',
            render: text => `${text/100}元`
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange
        }
        return (
            <Table loading={loading} dataSource={dataSource} columns={columns} pagination={pagination}/>
        )
    }
}

export default List