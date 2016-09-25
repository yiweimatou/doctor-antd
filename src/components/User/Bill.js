import React, {Component, PropTypes} from 'react'
import {
    Table,Row,Col,Button
} from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

class Money extends Component {
    render() {
        const { list, changeHandler, user, push, loading, total } = this.props
        const pagination = {
            pageSize: 9,
            showTotal: total => `共 ${total} 条`,
            onChange(offset) {
                
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
            dataIndex: 'state',
            key: 'state',
            render: text => {
              switch (text) {
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
            <div>
                <Row>
                    <Col span = {12} >
                        <span>
                            账户余额:<em style={{color:'orange'}}>{user.amount/100}</em>元
                        </span>
                    </Col>
                    <Col span = {12} >
                        <Row>
                            <Col span={8}>
                                <Button type='primary' onClick={()=>push('/user/recharge')}>
                                    充值
                                </Button>
                            </Col>
                            <Col span={8}>
                                 <Button type='ghost' onClick={()=>push('/user/deposit')}>
                                    提现
                                </Button>
                            </Col>
                            <Col span={8}>
                                 <Button onClick={()=>push('/user/money/alipay/set')}>
                                    设置提现账户
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Table
                    dataSource = {list}
                    columns = { columns }
                    pagination = { { ...pagination, total } }
                    loading = { loading }
                    style = {{marginTop:20}}
                />
            </div>
        )
    }
}

Money.propTypes = {
    list: PropTypes.array,
    user: PropTypes.object,
    total: PropTypes.number.isRequired,
    push: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default connect(
    state => ({
        list: state.bill.list,
        user: state.auth.user,
        loading: state.bill.loading,
        total: state.bill.total
    }),
    dispatch => ({
        changeHandler: params => dispatch({
            type: 'bill/list',
            payload: params
        }),
        push: path => dispatch(push(path))
    })
)(Money)
