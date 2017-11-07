import React, { Component } from 'react'
import { Button, Input,InputNumber, Table, message, Modal } from 'antd'
import organize_dealer_product from '../../../services/organize_dealer_product'
import organize_dealer from '../../../services/organize_dealer'

class DealerProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cname: '',
            loading: false,
            dataSource: [],
            total: 0,
            record: { },
            visible: false,
            inventory: 0,
        }
    }
    
    componentWillMount() {
        this.infoHandler()
    }

    onOk = () => {
        const {
            inventory, record
        } = this.state

        if (!record) {
            this.setState({ visible: false })
            message.error('修改失败')
        } else {
            organize_dealer_product.edit({
                id: record.id,
                inventory
            }).then(() => {
                message.success('修改成功')
                this.setState({ visible: false })
            }).catch(err => message.error(err))
        }
    }

    infoHandler = async () => {
        const { cname } = this.state
        const { id, pid } = this.props

        const params = {
            organize_id: id,
            product_id: pid,
        }
        if (cname) {
            const dealer = await organize_dealer.list({
                ...params,
                cname
            })
            if (dealer.list && dealer.list.length > 0) {
                params.dealer_account_id_list = dealer.list.map(v => v.account_id).join(',')  
            }
        }
        organize_dealer_product.info(params).then(data => {
            if (data.count > 0) {
                this.setState({ total: data.count })
                this.listHandler(1)
            } else {
                this.setState({ total: data.count, dataSource: [] })
            }
        }).catch(err => message.error(err))
    }

    listHandler = async offset => {
        const { cname } = this.state
        const { id, pid } = this.props

        const params = {
            organize_id: id,
            product_id: pid,
        }
        this.setState({ loading: true })
        if (cname) {
            const dealer = await organize_dealer.list({
                organize_id: id,
                cname
            })
            if (dealer.list && dealer.list.length > 0) {
                params.dealer_account_id_list = dealer.list.map(v => v.account_id).join(',')  
            }
        }
        organize_dealer_product.list({ ...params, offset, limit: 9 }).then(async data => {
            let list = []
            if (data.list && data.list.length > 0) {
                const dealers = await organize_dealer.list({
                    organize_id: id,
                    dealer_account_id_list: data.list.map(x => x.dealer_account_id).join(',')
                })
                list = await Promise.all(data.list.map(async v => {
                    const dealer = dealers.find(y => y.account_id === v.dealer_account_id)
                    if (dealer) {
                        return {
                            ...v,
                            dealer_cname: dealer.cname,
                            tel: dealer.tel
                        }
                    }
                    return v
                }))
            }
            this.setState({
                dataSource: list,
                loading: false
            })
        }).catch(err => {
            this.setState({ loading: false })
            message.error(err)
        })
    }
    
    render() {
        const {
            dataSource, total, loading
         } = this.state

        const columns = [
            { title: '经销商姓名', dataIndex: 'dealer_cname', key: 'dealer_cname' },
            { title: '手机号码', dataIndex: 'tel', key: 'tel' },
            { title: '库存', dataIndex: 'inventory', key: 'inventory' },
            { title: '操作', key: 'oper', render: (text, record) => 
                <Button onClick={() => {
                        this.setState({ record, visible: true, inventory: record.inventory })
                    }}>修改库存</Button>
            }
        ]
        const pagination = {
            total,
            showTotal: num => `共${num}条`,
            onChange: this.listHandler
        }
        return (
            <div>
                <Modal
                    title="修改库存"
                    onOk={this.onOk}
                    onCancel={() => this.setState({ visible: false, inventory: 0 })}
                    maskClosable={ false }
                    visible={this.state.visible}
                >
                    <div style={{ display: 'flex' }}>
                        <span>修改库存数</span>
                        <InputNumber style={{ width: 200 }} min={0} />
                    </div>
                </Modal>
                <div style={{ display: 'flex', marginBottom: 20 }}>
                    <Input style={{ width: 200, marginRight: 10 }} placeholder="经销商姓名" onChange={ e => this.setState({ inventory: e.target.value })} />
                    <Button type="primary" onClick={this.infoHandler}>搜索</Button>
                </div>
                <Table
                    rowKey="id"
                    dataSource={dataSource}
                    loading={loading}
                    pagination={pagination}
                    columns={columns}
                    bordered
                />    
            </div>
        );
    }
}

export default DealerProduct