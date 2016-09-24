/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Spin, Form, Steps, Table, message, Input, Tabs, Button, Modal } from 'antd'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  warpperCol: { span: 12 }
}


class AddTextPaper extends Component {
  state = {
    currentStep: 0,
    total: 0,
    myTotal: 0,
    topics: {},
    visible: false,
    confirmLoading: false
  }
  componentWillMount() {
    //获取分页信息
    this.props.getInfo({}, total => this.setState({ total }), error => message.error(error))
    this.props.getInfo({ account_id: this.props.userId }, total => this.setState({ myTotal: total }), error => message.error(error))
    this.props.changeHandler({ offset: 1, limit: 9 })
    this.props.changeHandler({ offset: 1, limit: 9, account_id: this.props.userId })
  }
  clickHandler = topics => {
    if (this.state.topics.id === topics.id) {
      message.warn('该试题已经引用！')
      this.setState({ currentStep:1 })
    } else {
     this.setState({ visible: true, topics })
    }
  }
  okHandler = () => {
    this.setState({ confirmLoading: true })
    this.props.buyTopics({
      organize_id: this.props.query.oid,
      lesson_id: this.props.query.lid,
      id: this.state.topics.id
    }, () => {
      message.success('引用成功')
      this.setState({ visible: false, currentStep: 1, confirmLoading: false })
    }, error => {
      this.setState({ confirmLoading: false })
      message.error(error)
    })
  }
  cancelHandler = () => {
    this.setState({ visible: false, topics: {} })
  }
  submitHandler = e => {
    e.preventDefault()
  }
  render() {
    const { currentStep, total, myTotal, visible, topics, confirmLoading } = this.state
    const { loading, list, myList, changeHandler, userId, query } = this.props
    if (!query.oid || !query.lid) {
      return (<div>参数错误</div>)
    }
    const { getFieldProps } = this.props.form
    const columns = [{
      dataIndex: 'title',
      key: 'title',
      title: '试卷标题'
    }, {
      dataIndex: 'sale_amount',
      key: 'sale_amount',
      title: '价格'
    }, {
      key: 'operation',
      title: '选择',
      render: (text, record) => <Button onClick={() => this.clickHandler(record) }>引用</Button>
    }]
    return (
        <div>
          <Modal title="购买试卷" visible={visible} confirmLoading = {confirmLoading} maskClosable={false}
                 onOk={this.okHandler} onCancel={this.cancelHandler}
          >
            <div style={{textAlign: 'center'}}>
              <p>试卷名称：{topics && topics.title}</p>
              <p>试卷价格：<em style={{color:'orange',fontSize:'200%'}}>{topics && topics.sale_amount}</em>元</p>
            </div>
          </Modal>
          <Steps current={currentStep}>
            <Step title="选择试卷"/>
            <Step title="文章基本信息"/>
          </Steps>
          { currentStep === 0 ?
            <Tabs>
              <TabPane tab="全部试卷" key="1">
                <Table dataSource={list}
                       columns={columns}
                       pagination={{
                         total: total, showTotal: total => `共${total}条`, onChange: offset => changeHandler({ offset, limit: 9 })
                       }}/>
              </TabPane>
              <TabPane tab="我的试卷" key="2">
                <Table dataSource={myList}
                       columns={columns}
                       pagination={{
                         total: myTotal, showTotal: total => `共${total}条`, onChange: offset => changeHandler({
                           offset, limit: 9, account_id: userId
                         })
                       }}
                />
              </TabPane>
            </Tabs>:null
          }
          {
            currentStep === 1 ?
              <Spin spinning={loading}>
                <Form>
                  <FormItem hasFeedback {...formItemLayout} label="文章标题">
                    <Input {...getFieldProps('title', {
                      rules: [{
                        required: true, whitespace: false, message: '请填写文章标题'
                      }]
                    })}/>
                    
                  </FormItem>
                  <FormItem {...formItemLayout} label="文章描述">
                    <Input type="textarea" rows={5} {...getFieldProps('descript')} />
                  </FormItem>
                </Form>
              </Spin>:null
          }
        </div>
    )
  }
}

AddTextPaper.propTypes = {
  list: PropTypes.array.isRequired,
  myList: PropTypes.array.isRequired,
  changeHandler: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  addSection: PropTypes.func.isRequired,
  getInfo: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  buyTopics: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired
}

export default connect(
  state => ({
    list: state.topics.list,
    myList: state.topics.myList,
    loading: state.section.loading,
    userId: state.auth.key,
    query: state.routing.locationBeforeTransitions.query
  }),
  dispatch => ({
    buyTopics: (params, resolve, reject) => {
      dispatch({
        type: 'topics/buy',
        payload: {
          params, resolve, reject
        }
      })
    },
    getInfo: (params, resolve, reject) => {
      dispatch({
        type: 'topics/info',
        payload: {
          params, resolve, reject
        }
      })
    },
    addSection: (params, resolve, reject) => {
      dispatch({
        type: 'section/add',
        payload: {
          params: resolve, reject
        }
      })
    },
    changeHandler: params => {
      if (params.account_id) {
        dispatch({
          type: 'topics/mylist',
          payload: {
            params, reject: error => message.error(error)
          }
        })
      } else {
        dispatch({
          type: 'topics/list',
          payload: {
            params, reject: error => message.error(error)
          }
        })
      }
    }
  })
)(Form.create()(AddTextPaper))
