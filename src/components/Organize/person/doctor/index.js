import React, { Component } from 'react'
import { Table, Button, Input, message, Modal } from 'antd'
import organize_doctor from '../../../../services/organize_doctor'
import organize_referee from '../../../../services/organize_referee'
import DoctorEdit from './edit'

class Doctor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name1: '', //医药代表姓名
      name2: '', //医生姓名
      total: 0,
      dataSource: [],
      loading: false,
      record: {},
      editVisible: false
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }

  editHandler = doctor => {
    return organize_doctor.edit(doctor).then(() => {
      this.setState(prevState => ({
        editVisible: false,
        dataSource: prevState.dataSource.map(v => {
          if (v.id === doctor.id) {
            return {
              ...v,
              ...doctor
            }
          }
          return v
        })
      }))
    }).catch(err => message.error(err))
  }
  infoHandler = async () => {
    const { name1, name2 } = this.state
    let params = {
      state: 1, organize_id: this.props.id, cname: name2
    }
    if (name1) {
      let ids = ''
      try {
        const result = await organize_referee.list({
          cname :name1, offset: 1, limit: 1000
        })
        if (result.list.length > 0) {
          ids = result.list.map(v => v.account_id).join(',')
        }
        if (ids) {
          params.referee_account_id_list = ids
        } else {
          return this.setState({
            total: 0,
            dataSource: []
          })
        }
      } catch(err) {
        message.error(err)
      }
    }
    organize_doctor.info(params).then(data => {
      this.setState({
        total: data.count
      })
      if (data.count > 0) {
        this.listHandler(1)
      } else {
        this.setState({
          dataSource: []
        })
      }
    }).catch(err => message.error(err))
  }

  listHandler = async offset => {
    const { name1, name2 } = this.state
    let params = {
      cname: name2,
      state: 1,
      organize_id: this.props.id,
      offset, limit: 9
    }
    if (name1) {
      let ids = ''
      try {
        const result = await organize_referee.list({
          cname :name1, offset: 1, limit: 1000
        })
        if (result.list.length > 0) {
          ids = result.list.map(v => v.account_id).join(',')
        }
        if (ids) {
          params.referee_account_id_list = ids
        } else {
          return this.setState({
            dataSource: []
          })
        }
      } catch(err) {
        message.error(err)
      }
    }
    this.setState({ loading: true })
    organize_doctor.list(params).then(async data => {
      let dataSource = []
      if (data.list.length > 0) {
        const account_ids = Array.from(new Set(data.list.map(v => v.referee_account_id))).join(',')
        const referees = await organize_referee.list({
          state: 1, account_id_list: account_ids
        })
        dataSource = data.list.map(v => {
          const referee = referees.list.find(k => k.account_id === v.referee_account_id)
          if (referee) {
            return {
              ...v,
              referee_cname: referee.cname
            }
          }
          return v
        })
      }
      this.setState({
        dataSource,
        loading: false
      })
    }).catch(err => {
      message.error(err)
      this.setState({
        loading: false
      })
    })
  }

  deleteHandler = id => {
    organize_doctor.delete({ id }).then(() => {
      message.success('删除成功!')
      this.setState(prevState => ({
        dataSource: prevState.dataSource.filter(v => v.id !== id),
        total: prevState.total - 1
      }))
    })
  }
  render() {
    const { name1, name2, total, loading, dataSource, record, editVisible } = this.state
    const columns = [{
      title: '医生姓名',
      dataIndex: 'cname',
      key: 'cname'
    }, {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit'
    }, {
      title: '科室',
      dataIndex: 'dept',
      key: 'dept'
    }, {
      title: '职务',
      dataIndex: 'duty',
      key: 'duty'
    }, {
      title: '职称',
      dataIndex: 'rank',
      key: 'rank'
    }, {
      title: '医药代表',
      dataIndex: 'referee_cname',
      key: 'referee_cname'
    }, {
      title: '签约时间',
      key: 'add_ms',
      dataIndex: 'add_ms',
      render: text => (new Date(text * 1000)).toLocaleString()
    }, {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark'
    }, {
      title: '操作',
      key: 'opear',
      render: (text, record) => {
        return (
                  <span>
                    <a onClick={() => this.setState({ record, editVisible: true })}>编辑</a>
                    <span className="ant-divider" />
                    <a onClick={() => this.deleteHandler(record.id)}>删除</a>
                  </span>)
      }
    }]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      pageSize: 9,
      onChange: this.listHandler
    }
    return (
      <div>
        <Modal
          title="编辑医生"
          maskClosable={false}
          visible={editVisible}
          onCancel={() => this.setState({ editVisible: false })}
          footer={null}
        >
          <DoctorEdit doctor={record} edit={this.editHandler}/>
        </Modal>
        <div style={{ width: 600, display: 'flex' }}>
          <Input 
            placeholder="医药代表姓名" 
            style={{ marginRight: 10 }}
            value = { name1 }
            onChange={e => this.setState({ name1: e.target.value })} />
          <Input 
            placeholder="医生姓名" 
            style={{ marginRight: 10 }}
            value={ name2 }
            onChange={ e => this.setState({ name2: e.target.value })} />
          <Button type="primary" onClick={this.infoHandler}>
            搜索
          </Button>
        </div>
        <Table 
          rowKey="id" 
          columns={columns} 
          pagination={pagination}
          bordered 
          dataSource={dataSource}
          loading={loading}
          bodyStyle={{ marginTop: 20 }} />
      </div>
    )
  }
}

export default Doctor