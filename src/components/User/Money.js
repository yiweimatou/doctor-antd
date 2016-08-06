import React, {Component, PropTypes} from 'react'
import {
    Table,Row,Col,Button
} from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

class Money extends Component {
    render() {
        const { list, changeHandler, user, push } = this.props
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
                        return '报名课程'
                    case 2:
                        return '推荐报名课程奖励'
                    case 3:
                        return '二级推荐报名课程奖励'
                    case 4:
                        return '出售板书'
                    case 5:
                        return '课程转入'
                    case 6:
                        return '提现'
                    case 7:
                        return '其它'
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
                                <Button type='primary'>
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
                    dataSource = {list.data}
                    columns = { columns }
                    pagination = { pagination }
                    loading = { list.loading }
                    style = {{marginTop:20}}
                />
            </div>
        )
    }
}

Money.propTypes = {
    list: PropTypes.object,
    user: PropTypes.object,
    push: PropTypes.func.isRequired
};

export default connect(
    state => ({
        list: state.user.money,
        user: state.auth.user
    }),
    dispatch => ({
        changeHandler: params => dispatch({
            type: 'user/money/list',
            payload: params
        }),
        push: path => dispatch(push(path))
    })
)(Money)