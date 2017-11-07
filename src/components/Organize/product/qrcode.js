import React, { Component } from 'react'
import { Form, Table, Button, Input, Row, InputNumber, Col, Modal, DatePicker, Select, message, Spin } from 'antd'
import RefereeSelect from '../person/referee_select'
import organize_products from '../../../services/organize_products'
import { downloadURI } from '../../../utils'

const RangePicker = DatePicker.RangePicker
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class ProductQrcode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      dataSource: [],
      total: 0,
      loading: false,
      dateStrings: ['', ''],
      state: '',
      downloading: false,
      selectVisible: false,
      referee: {}
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }

  infoHandler = () => {
    const { state, dateStrings } = this.state
    let params = {
      organize_id: this.props.id, product_id: this.props.pid
    }
    if (state) {
      params.state = state
    }
    if (dateStrings[0] && dateStrings[1]) {
      params.start_add_ms = dateStrings[0],
      params.end_add_ms = dateStrings[1]
    }
    organize_products.info(params).then(data => {
      this.setState({ total: data.count })
      if (data.count === 0) {
        this.setState({ dataSource: [] })
      } else {
        this.listHandler(1)
      }
    })
  }

  listHandler = offset => {
    const { dateStrings, state } = this.state
    let params = {
      organize_id: this.props.id, offset, limit: 9, product_id: this.props.pid
    }
    if (state) {
      params.state = state
    }
    if (dateStrings[0] && dateStrings[1]) {
      params.start_add_ms = dateStrings[0],
      params.end_add_ms = dateStrings[1]
    }
    organize_products.list(params).then(data => {
      this.setState({ dataSource: data.list, loading: false })
    }).catch(err => {
      message.error(err)
      this.setState({ loading: false })
    })
  }

  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  submitHandler = e => {
    e.preventDefault()
    if (!this.state.referee.account_id) return
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      const params = {
        num: values.num,
        remark: values.remark,
        organize_id: this.props.id,
        product_id: this.props.pid,
        referee_account_id: this.state.referee.account_id
      }
      this.setState({ downloading: true })
      organize_products.add(params).then(data => {
        downloadURI(data.path)
        this.infoHandler()
        this.setState({ visible: false, downloading: false })
      }).catch(err => {
        message.error(err)
        this.setState({ visible: false, downloading: false })
      })
    })
  }

  selectHandler = referee => {
    this.setState({
      referee,
      selectVisible: false
    })
  }
  
  render() {
    const { visible, loading, dataSource, total, state, selectVisible } = this.state
    const { getFieldDecorator } = this.props.form
    const columns = [
      { title: '编号', dataIndex: 'id', key: 'id' },
      { title: '明码', dataIndex: 'bright_qrcode', key: 'bright_qrcode' },
      { title: '暗码', dataIndex: 'dark_qrcode', key: 'dark_qrcode' },
      { title: '创建时间', dataIndex: 'add_ms', key: 'add_ms', render: text => (new Date(text * 1000)).toLocaleString() },
      { title: '状态', dataIndex: 'state', key: 'state', render: text => 
        text === 2 && '已使用' || text ===1 && '未使用' || text === 3 && '已删除' },
    ]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      onChange: this.listHandler,
      pageSize: 9
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Modal title="生产二维码" visible={visible} maskClosable={false} footer={null} onCancel={this.visibleToggle}>
          <Spin spinning = {this.state.downloading}>
            <Form onSubmit={this.submitHandler}>
              <Form.Item required label="医药代表" {...formItemLayout}>
                {this.state.referee.cname}<Button onClick={() => this.setState({ selectVisible: true})}>更换医药代表</Button>
                <RefereeSelect id={this.props.id} visible={selectVisible} onCancel={() => this.setState({ selectVisible: false })} onSelect={this.selectHandler} />
              </Form.Item>
              <Form.Item label="备注" {...formItemLayout}>
                {getFieldDecorator('remark', {
                  rules: [{ required: true }]
                })(<Input type="text" />)}
              </Form.Item>
              <Form.Item label="生成二维码套数" {...formItemLayout}>
                {getFieldDecorator('num', {
                  rules: [{ required: true }]
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6 }}>
                <Button type="primary" htmlType="submit">提交生成</Button>
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col lg={4} xl={3}>
            <Button onClick={this.visibleToggle}>添加产品二维码</Button>
          </Col>
          <Col lg={9} xl={7}>
            <RangePicker showTime={true} onChange={(dates, dateStrings) => this.setState({dateStrings})} format="YYYY-MM-DD HH:mm:ss"/>
          </Col>
          <Col lg={3} xl={2}>
            <Select style={{ width: 90 }} onChange={v => this.setState({ state: v })} value={state}>
              <Select.Option value=''>
                选择状态
              </Select.Option>
              <Select.Option value='1'>
                未使用
              </Select.Option>
              <Select.Option value='2'>
                已使用
              </Select.Option>
              <Select.Option value='3'>
                已删除
              </Select.Option>
            </Select>
          </Col>
          <Col lg={1} xl={1}>
            <Button type="primary" onClick={this.infoHandler}>搜索</Button>
          </Col>
        </Row>
        <Table rowKey="id" bordered loading={loading} columns={columns} dataSource={dataSource} pagination={pagination}/> 
      </div>
    )
  }
}

export default Form.create()(ProductQrcode)