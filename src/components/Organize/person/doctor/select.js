import React, { Component, PropTypes } from 'react'
import { Modal, Table, message, Button, Input } from 'antd'
import organize_referee from '../../../../services/organize_doctor'

class DoctorSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      dataSource: [],
      total: 0,
      cname: ''
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }
  
  infoHandler = () => {
    const { cname } = this.state
    organize_referee.info({
      organzie_id: this.props.id,
      cname
    }).then(data => {
      this.setState({ total: data.count })
      if (data.count === 0) {
        this.setState({ dataSource: [] })
      } else {
        this.listHandler(1)
      }
    })
  }
  listHandler = offset => {
    const { cname } = this.state
    this.setState({ loading: true })
    organize_referee.list({
      organzie_id: this.props.id,
      cname,
      offset, limit: 6
    }).then(data => {
      this.setState({
        dataSource: data.list,
        loading: false
      })
    }).catch(err => {
      message.error(err)
      this.setState({
        loading: false
      })
    })
  }
  render() {
    const { onCancel, onSelect, visible } = this.props
    const { total, dataSource, loading } = this.state
    const columns = [{
      title: '姓名',
      dataIndex: 'cname',
      key: 'cname'
    }, {
      title: '手机',
      dataIndex: 'mobile',
      key: 'mobile'
    }, {
      title: '操作',
      key: 'oper',
      render: (text, record) => 
        <Button type="primary" onClick={() => onSelect(record)}>选择</Button>
    }]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      pageSize: 6,
      onChange: this.listHandler
    }
    return (
      <Modal
        title="选择医生"
        footer={null}
        maskClosable={false}
        onCancel={onCancel}
        visible={visible}
      >
        <div>
          <div style={{ display: 'flex', margin: '10px 0' }}>
            <Input style={{ marginRight: 10 }} onChange={e => this.setState({ cname: e.target.value })} type="text" />
            <Button onClick={this.infoHandler}>搜索</Button>
          </div>
          <Table 
            rowKey="id"
            columns={columns}
            pagination={pagination}
            loading={loading}
            dataSource={dataSource}
          />
        </div>
      </Modal>
    )
  }
}

DoctorSelect.propTypes = {
  // id: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default DoctorSelect