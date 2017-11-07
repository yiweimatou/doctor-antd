import React, { Component } from 'react'
import { Row, Col, Table, Button, Input, Select, message } from 'antd'
import { connect } from 'react-redux'
import OrganizeBar from '../organize_bar'
import organzie_shop_trade from '../../../services/organzie_shop_trade'
import organize_product from '../../../services/organize_products'

//1未发货,2等待收货,3已收货,4退货中,5已退货
class TradeList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            total: 0,
            loading: false,
            cname: '',
            product_cname: ''
        }
    }
    
    componentWillMount() {
        this.listHandler()
    }

    format = async data => {
        try {
            const productIds = data.list.map(v => v.product_id).join(',')
            const products = await organize_product.list({
                limit: 1000,
                organize_id: this.props.organize.id,
                id_list: productIds
            })
            this.setState(prevState => ({
                loading: false,
                dataSource: prevState.dataSource.map(v => {
                    const product = products.list.find(x => x.id === v.product_id)
                    if (product) {
                        return {
                            ...v,
                            product_title: product.title
                        }
                    }
                    return v
                })
            }))
        } catch(e) {
            message.error(e)
            this.setState({ loading: false })
        }
    }

    listHandler = async offset => {
        const { product_cname, cname } = this.state
        const organize_id = this.props.organize.id
        let productIds = ''
        this.setState({ loading: true })
        let products = [] 
        if (product_cname) {
            try {
                products = await organize_product.list({
                    title: product_cname,
                    organize_id,
                    offset: 1,
                    limit: 1000
                })
                productIds = products.list.map(v => v.id).join(',')
            } catch(err) {
                message.error(err)
            }
        }
        if (offset === 1) {
            organzie_shop_trade.info({
                product_id_list: productIds,
                cname,
                organize_id,
            }).then(data => {
                this.setState({
                    total: data.count
                })
                if (data.count > 0) {
                    organzie_shop_trade.list({
                        limit: 6,
                        offset,
                        product_id_list: productIds,
                        cname,
                        organize_id,
                    }).then(this.format)
                } else {
                    this.setState({ loading: false })
                }
            }).catch(err => {
                message.error(err)
                this.setState({ loading: false })
            })
        } else {
            organzie_shop_trade.list({
                limit: 6,
                offset,
                product_id_list: productIds,
                cname,
                organize_id,
            }).then(this.format)
        }
    }

    sendOut = id => organzie_shop_trade.edit({ id }).then(() => {
        message.success('发货成功')
        this.setState(prevState => ({
            dataSource: prevState.dataSource.map(v => {
                if (v.id === id) {
                    return {
                        ...v,
                        state: 2
                    }
                }
                return v
            })
        }))
    }).catch(err => message.error(err))

    render() {
        const {
            loading, dataSource, total
        } = this.state
        const columns = [
            { title: '订单号', dataIndex: 'id', key: 'id' },
            { title: '产品名称', dataIndex: 'product_title', key: 'product_title' },
            { title: '数量', dataIndex: 'product_num', key: 'product_num' },
            { title: '收货人', dataIndex: 'cname', key: 'cname' },
            { title: '电话', dataIndex: 'tel', key: 'tel' },
            { title: '邮编', dataIndex: 'pcode', key: 'pcode' },
            { title: '收货地址', dataIndex: 'address', key: 'address' },
            { title: '状态', dataIndex: 'state', key: 'state', render: (text, record) =>
                text === 1 && <Button onClick={() => this.sendOut(record.id)} type="primary">发货</Button> ||
                text === 2 && '等待收货' ||
                text === 3 && '已收货' ||
                text === 4 && '退货中' ||
                text === 5 && '已退货'
            },
        ]
        const pagination = {
            total,
            showTotal: num => `共${num}条`,
            onChange: this.listHandler
        }
        return (
            <div>
                <OrganizeBar selectedKey="trade" organize={this.props.organize} />
                <Row gutter={16}>
                    <Col span={4}>
                        <Input placeholder="产品名称" />
                    </Col>
                    <Col span={4}>
                        <Input placeholder="收货人" />
                    </Col>
                    <Col span={3}>
                        <Select style={{ width: 100 }}>
                            <Select.Option value="1">未发货</Select.Option>
                            <Select.Option value="2">等待收货</Select.Option>
                            <Select.Option value="3">已收货</Select.Option>
                            <Select.Option value="4">退货中</Select.Option>
                            <Select.Option value="5">已退货</Select.Option>
                        </Select>
                    </Col>
                    <Col span={2}><Button type="primary" onClick={this.listHandler}>搜索</Button></Col>
                </Row>
                <Table
                    rowKey="id"
                    bodyStyle={{ marginTop: 20 }}
                    loading={loading} 
                    pagination={pagination}
                    columns={columns}
                    bordered
                    dataSource={dataSource}
                />
            </div>
        )
    }
}

export default connect(
    state => ({
        organize: state.organize.entity
    })
)(TradeList)