import React, {Component, PropTypes} from 'react'
import {
    Table
} from 'antd'
import { connect } from 'react-redux'

class Money extends Component {
    render() {
        const { list, changeHandler } = this.props
        const pagination = {
            total: list.total,
            defaultPageSize: list.params.limit,
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
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: text => {
                switch(text){
                    case 0:
                        return '未知'
                    case 1:
                        return '账户报名收入'
                    case 2:
                        return '机构认证收入'
                    case 3:
                        return '还信用额度'
                    case 4:
                        return '主讲提现'
                    case 5:
                        return '其他'
                }
            }
        }, {
            title: '详情',
            dataIndex: 'descript',
            key: 'descript'
        }]
        return (
            <Table
                dataSource = {list.data}
                columns = { columns }
                pagination = { pagination }
                loading = { list.loading }
            />
        )
    }
}

Money.propTypes = {
    list: PropTypes.object
};

export default connect(
    state => ({
        list: state.lesson.money
    }),
    dispatch => ({
        changeHandler: params => dispatch({
            type: 'lesson/money/list',
            payload: params
        })
    })
)(Money)