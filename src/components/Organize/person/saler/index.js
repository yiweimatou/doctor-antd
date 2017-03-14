import React, { Component } from 'react';
import { Input, Table, Button, message, Col } from 'antd'
import organize_saler from '../../../../services/organize_saler'
import organize_referee from '../../../../services/organize_referee'
import SalerEditor from './edit'

class OrganizeSaler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name1: '',
      name2: '',
      dataSource: [],
      total: 0,
      loading: false,
      editVisible: false,
      record: {}
    }
  }
  
  componentWillMount() {
    this.infoHandler()
  }
  
  infoHandler = async () => {
    const {
      name1, name2
    } = this.state
    let params = {
      cname: name2,
      state: 2,
      organize_id: this.props.id
    }
    if (name1) {
      try {
        const result = await organize_referee.list({ cname: name1, limit: 1000, offset: 1 })
        if (result.list.length === 0) {
          return this.setState({ dataSource: [], total: 0 })
        } else {
          params.referee_account_id_list = result.list.map(v => v.account_id).join(',')
        }
      } catch(err) {
        message.error(err)
      }
    }
    organize_saler.info(params).then(data => {
      this.setState({ total: data.count })
      if (data.count === 0) {
        this.setState({ dataSource: [] })
      } else {
        this.listHandler(1)
      }
    })
  }

  listHandler = async offset => {
    const { name1, name2 } = this.state
    let params = {
      cname: name2,
      limit: 9,
      offset, state: 2, organize_id: this.props.id
    }
    if (name1) {
      try {
        const result = await organize_referee.list({ cname: name1, limit: 1000, offset: 1})
        if (result.list.length === 0) {
          return this.setState({ dataSource: [] })
        } else {
          params.referee_account_id_list = result.list.map(v => v.account_id).join(',')
        }
      } catch(err) {
        message.error(err)
      }
    }
    this.setState({ loading: true })
    organize_saler.list(params).then(async data => {
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
      this.setState({ loading: false })
    })
  }

  deleteHandler = id => {
    organize_saler.delete({ id }).then(() => {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.filter(v => v.id !== id),
        total: prevState.total - 1
      }))
    }).catch(err => message.error(err))
  }

  editHandler = saler => {
    return organize_saler.edit(saler).then(() => {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.map(v => v.id === saler.id ? {
          ...v, ...saler
        }: v),
        editVisible: false,
        record: {}
      }))
    }).catch(err => message.error(err))
  }

  render() {
    const {
      name1, name2, loading, total, dataSource
    } = this.state 
    const columns = [
      { title: '销售姓名', dataIndex: 'cname', key: 'cname' },
      { title: '单位', dataIndex: 'unit', key: 'unit' },
      { title: '电话', dataIndex: 'mobile', key: 'mobile' },
      { title: '医药代表', dataIndex: 'referee_cname', key: 'referee_cname' },
      { title: '签约时间', dataIndex: 'add_ms', key: 'add_ms', render: text => (new Date(text * 1000)).toLocaleString() },
      { title: '备注', dataIndex: 'remark', key: 'remark' },
      { 
        title: '操作', key: 'oper', render: (text, record) => 
           <span>
            <a onClick={() => this.setState({ record, editVisible: true })}>编辑</a>
            <span className="ant-divider" />
            <a onClick={() => this.deleteHandler(record.id)}>删除</a>
          </span>
        
      }
    ]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      onChange: this.listHandler,
      pageSize: 9
    }
    return (
      <div>
         <SalerEditor saler={this.state.record} onCancel={() => {
            this.setState({ editVisible: false })
          }} edit={this.editHandler} visible={this.state.editVisible}/>
         <Input.Group>
           <Col span={4}>
            <Input type="text" value={name1} 
                    onChange={e => this.setState({ name1: e.target.value })} 
                    placeholder="医药代表姓名" 
            />
           </Col>
           <Col span={4}>
            <Input type="text" value={name2}
                    onChange={e => this.setState({ name2: e.target.value })}
                    placeholder="销售姓名"
            />
           </Col>
           <Col span={4}>
            <Button type="primary" onClick={this.infoHandler}>搜索</Button>
           </Col>
         </Input.Group> 
         <Table bodyStyle={{ marginTop: 20 }} rowKey="id" dataSource={dataSource} loading={loading} bordered columns={columns} pagination={pagination} />
      </div>
    );
  }
}

export default OrganizeSaler;