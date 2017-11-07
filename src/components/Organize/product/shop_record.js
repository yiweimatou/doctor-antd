import React, { Component } from 'react'
import { Row, DatePicker, Col, Input, Button, Table, message } from 'antd'
import organize_referee from '../../../services/organize_referee'
import organize_doctor from '../../../services/organize_doctor'
import organize_dealer from '../../../services/organize_dealer'
import organzie_shop_trade from '../../../services/organzie_shop_trade'
import { getUser } from '../../../services/user'

const RangePicker = DatePicker.RangePicker
class ShopTrade extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referee_cname: '',
            doctor_cname: '',
            dealer_cname: '',
            dataSource: [],
            loading: false,
            dateStrings: ['', '']
        }
    }
    
    componentWillMount() {
        this.infoHandler()
    }

    infoHandler = async () => {
        const { 
            doctor_cname,
            dealer_cname,
            referee_cname,
            dateStrings,
        } = this.state
        const {
            id, pid
        } = this.props
        const params = {
            organize_id: id,
            product_id: pid,
        }
        if (doctor_cname) {
            const doctors = await organize_doctor.list({
                cname: doctor_cname,
                organize_id: id,
            })
            if (doctors.list && doctors.list.length > 0) {
                params.doctor_account_id_list = doctors.list.map(v => v.account_id).join(',') 
            }
        }
        if (referee_cname) {
            const referees = await organize_referee.list({
                cname: referee_cname,
                organize_id: id
            })
            if (referees.list && referees.list.length > 0) {
                params.referee_account_id_list = referees.list.map(v => v.account_id).join(',')
            }
        }
        if (dealer_cname) {
            const dealers = await organize_dealer.list({
                cname: dealer_cname,
                organize_id: id
            })
            if (dealers.list && dealers.list.length > 0) {
                params.dealer_account_id_list = dealers.list.map(v => v.account_id).join(',')
            }
        }
        if (dateStrings[0] && dateStrings[1]) {
            params.start_put_ms = dateStrings[0]
            params.end_put_ms = dateStrings[1]
        }
        organzie_shop_trade.info(params).then(data => {
            this.setState({ total: data.count })
            if (data.count === 0) {
                this.setState({ dataSource: [] })
            } else {
                this.listHandler(1)
            }
        }).catch(err => message.error(err))
    }

    listHandler = async offset => {
        const { 
            doctor_cname,
            dealer_cname,
            referee_cname,
            dateStrings,
        } = this.state
        const {
            id, pid
        } = this.props
        this.setState({ loading: true })
        const params = {
            organize_id: id,
            product_id: pid,
            offset, limit: 9
        }
        if (doctor_cname) {
            const doctors = await organize_doctor.list({
                cname: doctor_cname,
                organize_id: id,
            })
            if (doctors.list && doctors.list.length > 0) {
                params.doctor_account_id_list = doctors.list.map(v => v.account_id).join(',') 
            }
        }
        if (referee_cname) {
            const referees = await organize_referee.list({
                cname: referee_cname,
                organize_id: id
            })
            if (referees.list && referees.list.length > 0) {
                params.referee_account_id_list = referees.list.map(v => v.account_id).join(',')
            }
        }
        if (dealer_cname) {
            const dealers = await organize_dealer.list({
                cname: dealer_cname,
                organize_id: id
            })
            if (dealers.list && dealers.list.length > 0) {
                params.dealer_account_id_list = dealers.list.map(v => v.account_id).join(',')
            }
        }
        if (dateStrings[0] && dateStrings[1]) {
            params.start_put_ms = dateStrings[0]
            params.end_put_ms = dateStrings[1]
        }
        organzie_shop_trade.list(params).then(async data => {
            const list = await Promise.all(data.list.map(async v => {
                if (v.rcmd1_account_id === 0) {
                    v.rcmd1_account_cname = ''
                } else {
                    const rcmd1 = await getUser({ id: v.rcmd1_account_id })
                    v.rcmd1_account_cname = rcmd1.get.cet_cname || rcmd1.get.cname
                }
                if (v.rcmd2_account_id === 0) {
                    v.rcmd2_account_cname = ''
                } else {
                    const rcmd2 = await getUser({ id: v.rcmd2_account_id })
                    v.rcmd2_account_cname = rcmd2.get.cet_cname || rcmd2.get.cname
                }
                if (v.referee_account_id === 0) {
                    v.referee_cname = ''
                } else {
                    const referee = await organize_referee.get({ account_id: v.referee_account_id })
                    v.referee_cname = referee.get.cname
                }
                if (v.doctor_account_id === 0) {
                    const doctor = await organize_doctor.get({ account_id: v.doctor_account_id })
                    v.doctor_cname = doctor.get.cname
                }
                if (v.dealer_account_id) {
                    const dealer = await organize_dealer.get({ account_id: v.dealer_account_id })
                    v.dealer_cname = dealer.get.cname
                }
                return v
            })).catch(err => {
                message.error(err)
                this.state({ loading: false })
            })
            this.setState({ dataSource: list, loading: false })
        })
    }
    
    render() {
        const { 
            total, loading, referee_cname, doctor_cname, dealer_cname, dataSource
        } = this.state
        const columns = [
           { title: '订单号', dataIndex: 'id', key: 'id' },
           { title: '消费者', dataIndex: 'customer_cname', key: 'customer_cname' },
           { title: '医药代表', dataIndex: 'referee_cname', key: 'referee_cname' },
           { title: '出货备注', dataIndex: 'remark', key: 'remark' },
           { title: '店铺', dataIndex: 'sname', key: 'sname' },
           { title: '一级推销员', dataIndex: 'rcmd1_account_name', key: 'rcmd1_account_name' },
           { title: '二级推销员', dataIndex: 'rcmd2_account_name', key: 'rcmd2_account_name' },
           { title: '医生', dataIndex: 'doctor_cname', key: 'doctor_cname' },
           { title: '经销商', dataIndex: 'dealer_cname', key: 'dealer_cname' },
           { title: '购买时间', dataIndex: 'put_ms', key: 'put_ms', render: text => (new Date(text * 1000)).toLocaleString() },
        ]
        const pagination = {
            total,
            showTotal: num => `共${num}条`,
            onChange: this.listHandler
        }
        return (
            <div>
                <Row gutter={16}>
					<Col lg={9} xl={7}>
					<RangePicker onChange={(dates, dateStrings) => this.setState({dateStrings})} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>
					</Col>
					<Col lg={4} xl={4}>
					<Input type="text" value={referee_cname}
						onChange={e => this.setState({ referee_cname: e.target.value })}
						placeholder="医药代表姓名"
					/>
					</Col>
					<Col lg={4} xl={4}>
					<Input type="text" value={doctor_cname}
						onChange={e => this.setState({ doctor_cname: e.target.value })}
						placeholder="医生姓名"
					/>
					</Col>
					<Col lg={4} xl={4}>
					<Input type="text" value={dealer_cname}
						onChange={e => this.setState({ dealer_cname: e.target.value })}
						placeholder="经销商"
					/>
					</Col>
					<Col lg={2} xl={2}>
					<Button type="primary" onClick={this.infoHandler}>搜索</Button>
					</Col>
				</Row>
				<Table rowKey="id" bodyStyle={{ marginTop: 20 }}
					bordered loading={loading} dataSource={dataSource} columns={columns} pagination={pagination}
				/>
            </div>
        )
    }
}

export default ShopTrade