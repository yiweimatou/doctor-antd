import React, { Component, PropTypes } from 'react'
import { Table, message } from 'antd'
import { connect } from 'react-redux'
import { LESSON } from '../../constants/api'

class Bill extends Component {
    componentWillMount() {
      const { changeHandler, query } = this.props
      if (!query.id) return
      changeHandler({
        category_id: LESSON,
        foreign_id: query.id,
        limit: 9,
        offset: 1
      }, null, error => message.error(error))
    }
    render() {
        const { list, changeHandler, loading, query } = this.props
        if (!query.id) {
          return (<div>参数错误</div>)
        }
        const pagination = {
            total: list.total,
            pageSize: 9,
            showTotal: total => `共 ${total} 条`,
            onChange(current) {
                changeHandler({
                  category_id: LESSON,
                  foreign_id: query.id,
                  limit: 9,
                  offset:current
                }, null, error => message.error(error))
            }
        }
        const columns = [{
            title: '交易号',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '金额',
            dataIndex: 'trade_amount',
            key: 'trade_amount',
            render: text => `${text/100}元`
        }, {
            title: '交易时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }, {
            title: '交易状态',
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
                dataSource = {list}
                columns = { columns }
                pagination = { pagination }
                loading = { loading }
            />
        )
    }
}

Bill.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    changeHandler: PropTypes.func.isRequired
};

export default connect(
    state => ({
        list: state.bill.list,
        loading: state.bill.loading,
        query: state.routing.locationBeforeTransitions.query
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
