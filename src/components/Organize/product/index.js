import React, { Component } from 'react'
import { Input, Button, Table, message, Col } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import OrganizeBar from '../organize_bar'
import organize_product from '../../../services/organize_product'
import ProductAdd from './add'

class Product extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSoucre: [],
      total: 0,
      visible: false,
      title: ''
    }
  }
  
  componentWillMount() {
    if (this.props.organize.id) {
      this.infoHandler()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.organize.id !== nextProps.organize.id) {
      this.infoHandler()
    }
  }
  
  
  infoHandler = () => {
    organize_product.info({
      title: this.state.title, state: 1, organize_id: this.props.organize.id
    }).then(data => {
      this.setState({ total: data.count })
      if (data.count === 0) {
        this.setState({ dataSoucre: [] })
      } else {
        this.listHandler(1)
      }
    })
  }

  listHandler = offset => {
    this.setState({ loading: true })
    organize_product.list({
      title: this.state.title,
      offset, limit: 9, state: 1, organize_id: this.props.organize.id
    }).then(data => {
      this.setState({ dataSoucre: data.list, loading: false })
    }).catch(err => {
      message.error(err)
      this.setState({ loading: false })
    })
  }

  deleteHandler = id => {
    organize_product.delete({ id }).then(() => {
      message.success('删除成功!')
      this.setState(prevState => ({
        dataSoucre: prevState.dataSoucre.filter(v => v.id !== id),
        total: prevState.total - 1
      })).catch(err => message.error(err))
    })
  }

  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  addHandler = product => {
    return organize_product.add({
      ...product,
      organize_id: this.props.organize.id }).then(data => {
      this.setState(prevState => ({
        dataSoucre: [{ ...product, id: data.identity, add_ms: data.sysdate }].concat(prevState.dataSoucre),
        total: prevState.total + 1,
        visible:false
      }))
    })
  }

  render() {
    const { 
      title, loading, total, dataSoucre, visible
    } = this.state
    const columns = [
      { title: '产品名称', dataIndex: 'title', key: 'title' },
      { title: '新增时间', dataIndex: 'add_ms', key: 'add_ms', render: text => (new Date(text * 1000)).toLocaleString() },
      { title: '备注', dataIndex: 'remark', key: 'remark' },
      { title: '操作', key: 'oper', render: (text, record) => (
        <span>
          <Link to={`/organize/${this.props.organize.id}/product/${record.id}`}>查看</Link>
          <span className="ant-divider" />
          <a onClick={this.deleteHandler}>删除</a>
        </span>
      )}
    ]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      pageSize: 9,
      onChange: this.listHandler
    }
    return (
      <div>
        <OrganizeBar organize={this.props.organize} selectedKey="product" />
        <ProductAdd visible={visible} onCancle={this.visibleToggle} onOk={this.addHandler}/>
        <Input.Group>
          <Col span={2}>
            <Button type="primary" onClick={this.visibleToggle}>添加产品</Button>
          </Col>
          <Col span={3}>
            <Input type="text" value={title} onChange={
              e => this.setState({ title: e.target.value })}
            />
          </Col>
          <Col span={2}>
            <Button onClick={this.infoHandler}>搜索</Button>
          </Col>
        </Input.Group>
        <Table bodyStyle={{ marginTop: 20 }} rowKey="id" loading={loading} dataSource={dataSoucre} bordered columns={columns} pagination={pagination} />
      </div>
    )
  }
}

export default connect(
  state => ({
    organize: state.organize.entity
  })
)(Product)