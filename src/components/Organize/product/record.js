import React, { Component } from 'react'
import { Table, Col, Row, Input, Button, message, DatePicker, Tabs } from 'antd'
import organize_products from '../../../services/organize_products'
import organize_referee from '../../../services/organize_referee'
import organize_doctor from '../../../services/organize_doctor'
import organize_saler from '../../../services/organize_saler'
import { getUser } from '../../../services/user'
import ShopRecord from './shop_record'

const RangePicker = DatePicker.RangePicker
class ProductRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      total: 0,
      loading: false,
      referee_cname: '',
      doctor_cname: '',
      saler_cname: '',
      dateStrings: ['', '']
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }

  infoHandler = async () => {
    const { referee_cname, doctor_cname, saler_cname, dateStrings } = this.state
    let params = { state: 2, organize_id: this.props.id, product_id: this.props.pid } //2表示已经使用
    if (referee_cname) {
      const referee = await organize_referee.list({
        cname: referee_cname
      })
      if (referee.list && referee.list.length > 0) {
        params.referee_account_id_list = referee.list.map(v => v.account_id).join(',')
      }
    }
    if (doctor_cname) {
      const doctor = await organize_doctor.list({
        cname: doctor_cname
      })
      if (doctor.list && doctor.list.length > 0) {
        params.doctor_account_id_list = doctor.list.map(v => v.account_id).join(',')
      }
    }
    if (saler_cname) {
      const saler = await organize_saler.list({ cname: saler_cname })
      if (saler.list && saler.list.length > 0) {
        params.saler_account_id_list = saler.list.map(v => v.account_id).join(',')
      }
    }
    if (dateStrings[0] && dateStrings[1]) {
      params.start_put_ms = dateStrings[0]
      params.end_put_ms = dateStrings[1]
    }
    organize_products.info(params).then(data => {
      this.setState({ total: data.count })
      if (data.count === 0) {
        this.setState({ dataSource: [] })
      } else {
        this.listHandler(1)
      }
    }).catch(err => message.error(err))
  }

  listHandler= async offset => {
    const { referee_cname, doctor_cname, saler_cname, dateStrings } = this.state
    let params = { state: 2, organize_id: this.props.id, offset, limit: 9, product_id: this.props.pid } //2表示已经使用
    this.setState({ loading: true })
    if (referee_cname) {
      const referee = await organize_referee.list({
        cname: referee_cname
      })
      if (referee.list && referee.list.length > 0) {
        params.referee_account_id_list = referee.list.map(v => v.account_id).join(',')
      }
    }
    if (doctor_cname) {
      const doctor = await organize_doctor.list({
        cname: doctor_cname
      })
      if (doctor.list && doctor.list.length > 0) {
        params.doctor_account_id_list = doctor.list.map(v => v.account_id).join(',')
      }
    }
    if (saler_cname) {
      const saler = await organize_saler.list({ cname: saler_cname })
      if (saler.list && saler.list.length > 0) {
        params.saler_account_id_list = saler.list.map(v => v.account_id).join(',')
      }
    }
    if (dateStrings[0] && dateStrings[1]) {
      params.start_put_ms = dateStrings[0]
      params.end_put_ms = dateStrings[1]
    }
    organize_products.list(params).then(async data => {
      const list = await Promise.all(data.list.map(async v => {
        if (v.customer_account_id === 0) {
          v.customer_cname = '无'
        } else {
          const user = await getUser({ id: v.customer_account_id })
          v.customer_cname = user.get.cet_cname || user.get.cname
        }
        if (v.referee_account_id === 0) {
          v.referee_cname = '无'
        } else {
          const referee = await organize_referee.get({ account_id: v.referee_account_id })
          v.referee_cname = referee.get.cname
        }
        if (v.saler_referee_account_id === 0) {
          v.saler_referee_cname = '无'
        } else {
          const saler_referee = await organize_referee.get({ account_id: v.saler_referee_account_id })
          v.saler_referee_cname = saler_referee.get.cname
        }
        if (v.doctor_account_id === 0) {
          v.doctor_cname = '无'
        } else {
          const doctor = await organize_doctor.get({ account_id: v.doctor_account_id })
          v.doctor_cname = doctor.get.cname
        }
        if (v.saler_account_id === 0) {
          v.saler_cname = '无'
        } else {
          const saler = await organize_saler.get({ account_id: v.saler_account_id })
          v.saler_cname = saler.get.cname
        }
        if (v.rmcd_customer_account_id === 0) {
          v.rmcd_customer_cname = '无'
        } else {
          const customer = await getUser({ id: v.rmcd_customer_account_id })
          v.rmcd_customer_cname = customer.get.cet_cname || customer.get.cname
        }
        return v
      }))
      this.setState({ dataSource: list, loading: false })
    }).catch(err => {
      message.error(err)
      this.setState({ loading: false })
    })
  }
  
  render() {
    const {
      referee_cname, doctor_cname, saler_cname,
      total, loading, dataSource,
    } = this.state
    const columns = [
      { title: '编号', dataIndex: 'id', key: 'id' },
      { title: '消费者', dataIndex: 'customer_cname', key: 'customer_cname' },
      { title: '医药代表', dataIndex: 'referee_cname', key: 'referee_cname' },
      { title: '出货备注', dataIndex: 'remark', key: 'remark' },
      { title: '地区医药代表', dataIndex: 'saler_referee_cname', key: 'saler_referee_cname' },
      { title: '医生', dataIndex: 'doctor_cname', key: 'doctor_cname' },
      { title: '销售', dataIndex: 'saler_cname', key: 'saler_cname' },
      { title: '消费者上级', dataIndex: 'rmcd_customer_cname', key: 'rmcd_customer_cname' },
      { title: '购买时间', dataIndex: 'put_ms', key: 'put_ms', render: text => (new Date(text * 1000)).toLocaleString() },
    ]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      pageSize: 9,
      onChange: this.listHandler
    }
    return (
        <Tabs>
			<Tabs.TabPane key="1" tab="线下二维码">
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
					<Input type="text" value={saler_cname}
						onChange={e => this.setState({ saler_cname: e.target.value })}
						placeholder="销售姓名"
					/>
					</Col>
					<Col lg={2} xl={2}>
					<Button type="primary" onClick={this.infoHandler}>搜索</Button>
					</Col>
				</Row>
				<Table rowKey="id" bodyStyle={{ marginTop: 20 }}
					bordered loading={loading} dataSource={dataSource} columns={columns} pagination={pagination}
				/>
			</Tabs.TabPane>
			<Tabs.TabPane key="2" tab="商城">
				<ShopRecord id={this.props.id} pid={this.props.pid}/>
			</Tabs.TabPane>
        </Tabs>
    )
  }
}

export default ProductRecord