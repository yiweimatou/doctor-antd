import React, {Component, PropTypes} from 'react';
import {
    Table
} from 'antd'
import { connect } from 'react-redux'
import { ORGANIZE } from '../../constants/api'

class Bill extends Component {
    render() {
        const { list, changeHandler, loading, total, id } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            pageSize: 9,
            onChange: offset => changeHandler({
                offset, limit:9, foreign_id: id, category_id: ORGANIZE
            })
        }
        const columns = [{
            title: '交易号',
            dataIndex: 'order_no',
            key: 'order_no'
        }, {
            title: '金额',
            dataIndex: 'trade_amount',
            key: 'trade_amount'
        }, {
            title: '交易时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }, {
            title: '状态',
            dataIndex: 'dispose',
            key: 'dispose',
            render: text => {
                switch(text){
                    case 1:
                    case 2:
                      return '交易中'
                    case 4:
                        return '交易失败'
                    case 3:
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
                dataSource = { list }
                columns = { columns }
                loading = { loading }
                pagination = {{
                    ...pagination,
                    total
                }}
            />
        )
    }
}

Bill.propTypes = {
    list: PropTypes.array.isRequired,
    changeHandler: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired
};

export default connect(
    state => ({
        list: state.bill.list,
        loading: state.bill.loading,
        total: state.bill.total,
        id: state.routing.locationBeforeTransitions.pathname.split('/')[3]
    }),
    dispatch => ({
        changeHandler: (params, resolve, reject) => dispatch({
            type: 'bill/list',
            payload: {
              params, resolve, reject
            }
        })
    })
)(Bill)
