import React, { Component } from 'react'
import { Row, Col, Input, Button, Table, message, Modal } from 'antd'
import DealerEdit from './edit'
import organize_dealer from '../../../../services/organize_dealer'
import organize_doctor from '../../../../services/organize_doctor'
import organize_referee from '../../../../services/organize_referee'
import { listLesson } from '../../../../services/lesson'

class Dealer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      area: '',
      dataSource: [],
      total: 0,
      loading: false,
      record: {},
      editVisible: false
    }
  }

  componentWillMount() {
    this.infoHandler()
  }
  
  infoHandler = () => {
    const { name, area } = this.state
    organize_dealer.info({
      cname: name, area, organize_id: this.props.id, state: 1
    }).then(data => {
      if (data.count === 0) {
        this.setState({ total: 0, dataSource: [] })
      } else {
        this.setState({ total: data.count })
        this.listHandler(1)
      }
    }).catch(e => message.error(e))
  }

  listHandler = offset => {
    const { name, area } = this.state
    this.setState({ loading: true })
    organize_dealer.list({
      cname: name, area, offset, limit: 9, state: 1
    }).then(async data => {
      let dataSource = []
      if (data.list.length > 0) {
        try {
          const referee_ids = Array.from(new Set(data.list.map(v => v.referee_account_id))).join(',')
          const doctor_ids = Array.from(new Set(data.list.map(v => v.doctor_account_id))).join(',')
          const lesson_ids = Array.from(new Set(data.list.map(v => v.lesson_id))).join(',')
          const referees = await organize_referee.list({
            account_id_list: referee_ids
          })
          const doctors = await organize_doctor.list({
            account_id_list: doctor_ids
          })
          const lessons = await listLesson({ id_list: lesson_ids })
          dataSource = data.list.map(v => {
            const referee = referees.list.find(x => x.account_id === v.referee_account_id)
            const doctor = doctors.list.find(z => z.account_id === v.doctor_account_id)
            const lesson = lessons.list.find(y => y.id === v.lesson_id)
            if (referee) {
              v = {
                ...v,
                referee_cname: referee.cname,
              }
            }
            if (doctor) {
              v = {
                ...v,
                doctor_cname: doctor.cname,
              }
            }
            if (lesson) {
                v = {
                    ...v,
                    lesson_cname: lesson.title
                }
            }
            return v 
          })
        } catch(e) {
          message.error(e)
        }
      }
      this.setState({ dataSource, loading: false })
    }).catch(e => {
      this.setState({ loading: false })
      message.error(e)
    })
  }

  editHandler = dealer => 
    organize_dealer.edit(dealer).then(() => {
      this.setState(prevState => ({
        dataSource: prevState.dataSource.map(v => {
          if (v.id === dealer.id) {
              return {
                  ...v,
                  ...dealer
              }
          }
          return v
        }),
        editVisible: false
      }))
    })

  deleteHandler = id => {
      organize_dealer.delete({ id }).then(() => {
          this.setState(prevState => ({
              dataSource: prevState.dataSource.filter(v => v.id != id)
          }))
          message.success('删除成功！')
      }).catch(err => message.error(err))
  }

  render() {
    const { 
      name,
      area,
      dataSource,
      loading,
      total,
    } = this.state

    const columns = [
      { title: '经销商姓名', key: 'cname', dataIndex: 'cname' },
      { title: '电话', key: 'tel', dataIndex: 'tel' },
      { title: '单位', key: 'unit', dataIndex: 'unit' },
      { title: '店名', key: 'sname', dataIndex: 'sname' },
      { title: '关联医生', key: 'doctor_name', dataIndex: 'doctor_cname' },
      { title: '医药代表', key: 'referee_name', dataIndex: 'referee_cname' },
      { title: '地区', key: 'area', dataIndex: 'area', },
      { title: '下线人数', key: 'num', dataIndex: 'num' },
      { title: '签约时间',
        key: 'add_ms',
        dataIndex: 'add_ms',
        render: text => (new Date(text * 1000)).toLocaleString()
      },
      { title: '操作', key: 'oper', render: (text, record) => 
                 <span>
                    <a onClick={() => this.setState({ record, editVisible: true })}>编辑</a>
                    <span className="ant-divider" />
                    <a onClick={() => this.deleteHandler(record.id)}>删除</a>
                  </span> },
    ]
    const pagination = {
      total,
      showTotal: num => `共${num}条`,
      onChange: this.listHandler
    }
    return (
      <div>
        <Modal
          title="编辑医生"
          maskClosable={false}
          visible={this.state.editVisible}
          onCancel={() => this.setState({ editVisible: false })}
          footer={null}
        >
          <DealerEdit dealer={this.state.record} edit={this.editHandler}/>
        </Modal>
        <Row gutter={16}>
          <Col lg={4} xl={4}>
            <Input 
              placeholder="经销商姓名" 
              value = { name }
              onChange={e => this.setState({ name: e.target.value })} />
          </Col>
          <Col lg={4} xl={4}>
            <Input 
              placeholder="地区" 
              value={ area }
              onChange={ e => this.setState({ area: e.target.value })} />
          </Col>
          <Col lg={4} xl={4}>
            <Button type="primary" onClick={this.infoHandler}>
              搜索
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          dataSource={dataSource}
          loading={loading}
          bodyStyle={{ marginTop: 20 }}
          columns={columns} 
          pagination={pagination}
          bordered
        />
      </div>
    );
  }
}

export default Dealer