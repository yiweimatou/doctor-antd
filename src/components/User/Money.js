import React, {Component, PropTypes} from 'react'
import {
    Table,Row,Col,Button
} from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

class Money extends Component {
    render() {
        const { list, changeHandler, user, push, loading } = this.props
        const pagination = {
            total: list.total,
            pageSize: list.params.limit,
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
              switch (text) {
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
            <div>
                <Row>
                    <Col span = {12} >
                        <span>
                            账户余额:<em style={{color:'orange'}}>{user.amount_money}</em>元
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
                                 <Button>
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
                    dataSource = {list.records}
                    columns = { columns }
                    pagination = { pagination }
                    loading = { loading }
                    style = {{marginTop:20}}
                />
            </div>
        )
    }
}

Money.propTypes = {
    list: PropTypes.object,
    user: PropTypes.object,
    push: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

export default connect(
    state => ({
        list: state.money.user,
        user: state.auth.user,
        loading: state.money.actionStatus.fetch.pending
    }),
    dispatch => ({
        changeHandler: params => dispatch({
            type: 'money/fetchlist',
            payload: params
        }),
        push: path => dispatch(push(path))
    })
)(Money)
