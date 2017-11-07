import React, { Component } from 'react'
import { Button, Input, message, Table, Modal, Row, Col } from 'antd'
import organize_referee from '../../../services/organize_referee'
import RefereeAdd from './referee_add'
import RefereeEdit from './referee_edit'

class Referee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cname: '',
      mobile: '',
      list: [],
      loading: false,
      total: 0,
      record: {},
      addVisible: false,
      editVisible: false,
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }
  
  infoHandler = () => {
    const { cname, mobile } = this.state
    organize_referee.info({
      cname, mobile, state: 1, organize_id: this.props.id
    }).then(data => {
      this.setState({
        total: data.count
      })
      if (data.count > 0) {
        this.listHandler(1)
      } else {
        this.setState({ list: [] })
      }
    })
  }

  listHandler = offset => {
    const { cname, mobile } = this.state
    this.setState({
      loading: true
    })
    organize_referee.list({
      offset, limit: 9, cname, mobile, state: 1, organize_id: this.props.id
    }).then(data => {
        this.setState({
          list: data.list,
          loading: false
        })
    }).catch(err => {
      message.error(err)
      this.setState({ loading: false })
    })
  }

  deleteHandler = id => {
    organize_referee.delete({ id }).then(() => {
      this.setState(prevState => ({
        list: prevState.list.filter(v => v.id !==id),
        total: prevState.total - 1
      }))
    }).catch(err => message.error(err))
  }

  addVisibleToggle = () => this.setState(prevState => ({
    addVisible: !prevState.addVisible
  }))

  editVisibleToggle = () => this.setState(prevState => ({
    editVisible: !prevState.editVisible
  }))

  addResolve = referee => {
    // console.log(referee)
    this.setState(prevState => ({
      list: [referee].concat(prevState.list),
      total: prevState.total + 1,
      addVisible: false
    }))
  }

  editHandler = referee => {
    return organize_referee.edit(referee).then(() => {
      this.setState(prevState => ({
        editVisible: false,
        list: prevState.list.map(v => {
          if (v.id === referee.id) {
            return {
              ...v,
              ...referee
            }
          } else {
            return v
          }
        })
      }))
    })
  }

  render() {
    const { cname, mobile, list, total, loading, addVisible, editVisible } = this.state
    const columns = [{
      title: '姓名',
      dataIndex: 'cname',
      key: 'cname'
    }, {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    }, {
      title: '操作',
      key: 'opear',
      render: (text, record) => {
        return (
          <span>
            <a onClick={() => this.setState({ record, editVisible: true })}>编辑</a>
            <span className="ant-divider" />
            <a onClick={() => this.deleteHandler(record.id)}>删除</a>
          </span>
        )
      }
    }]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      onChange: this.listHandler,
      pageSize: 9
    }
    return (
      <div>
        <Modal width={720} visible={addVisible} maskClosable={false} onCancel={this.addVisibleToggle} footer={null}>
          <RefereeAdd id={this.props.id} addResolve={this.addResolve} />
        </Modal>
        <Modal visible={editVisible} maskClosable={false} onCancel={this.editVisibleToggle} footer={null}>
          <RefereeEdit referee={this.state.record} edit={this.editHandler} />
        </Modal>
        <Row gutter={16}>
          <Col lg={3} xl={2}>
          <Button onClick={this.addVisibleToggle}>
            添加医药代表
          </Button>
          </Col>
          <Col lg={4} xl={3}>
          <Input 
            placeholder="姓名" 
            value = { cname }
            onChange={e => this.setState({ cname: e.target.value })} />
          </Col>
          <Col lg={4} xl={3}>
          <Input 
            placeholder="手机号码" 
            value={ mobile }
            onChange={ e => this.setState({ mobile: e.target.value })} />
          </Col>
          <Col lg={4} xl={2}>
          <Button type="primary" onClick={this.infoHandler}>
            搜索
          </Button>
          </Col>
        </Row>
        <Table 
          rowKey="id" 
          columns={columns} 
          pagination={pagination}
          bordered 
          dataSource={list}
          loading={loading}
          bodyStyle={{ marginTop: 20 }} />
      </div>
    )
  }
}

export default Referee