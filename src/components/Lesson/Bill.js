import React, {Component, PropTypes} from 'react'
import {
    Table
} from 'antd'
import { connect } from 'react-redux'

class Money extends Component {
    render() {
        const { list, changeHandler, loading } = this.props
        const pagination = {
            total: list.total,
            pageSize: 6,
            showTotal: total => `共 ${total} 条`,
            onChange(current) {
                changeHandler({...list.params,offset:current})
            }
        }
        const columns = [{
            title: '交易号',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '金额',
            dataIndex: 'money',
            key: 'money'
        }, {
            title: '交易时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }, {
            title: '交易状态',
            dataIndex: 'cet',
            key: 'cet',
            render: text => {
                switch(text){
                    case 1:
                    case 2:
                        return '交易中'
                    case 3:
                        return '交易失败'
                    case 4:
                        return '交易成功'
                }
            }
        }, {
            title: '详情',
            dataIndex: 'descript',
            key: 'descript'
        }]
        return (
            <Table
                dataSource = {list.records}
                columns = { columns }
                pagination = { pagination }
                loading = { loading }
            />
        )
    }
}

Money.propTypes = {
    list: PropTypes.object,
    loading: PropTypes.bool.isRequired
};

export default connect(
    state => ({
        list: state.money.lesson,
        loading: state.money.actionStatus.fetch.pending
    }),
    dispatch => ({
        changeHandler: params => dispatch({
            type: 'money/list',
            payload: params
        })
    })
)(Money)
