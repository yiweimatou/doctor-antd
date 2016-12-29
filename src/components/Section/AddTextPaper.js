/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Spin, Form, Steps, Table, message, Input, Tabs, Button, Modal } from 'antd'
import { TOPICS } from '../../constants/api'
import LessonBar from '../Lesson/LessonBar'
import OrganizeBar from '../Organize/organize_bar'
import { push } from 'react-router-redux'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}


class AddTextPaper extends Component {
  state = {
    topicList: [],
    currentStep: 0,
    total: 0,
    myTotal: 0,
    topics: {},
    tempTopics: {},
    visible: false,
    section: {},
    confirmLoading: false,
    topic_num: 1
  }
  componentWillMount() {
    const { getInfo, changeHandler, query, fetchSection, fetchTopics, buyTopics } = this.props
    //获取分页信息
    getInfo({}, total => this.setState({ total }), error => message.error(error))
    getInfo({ account_id: this.props.userId }, total => this.setState({ myTotal: total }), error => message.error(error))
    changeHandler({ offset: 1, limit: 9 })
    changeHandler({ offset: 1, limit: 9, account_id: this.props.userId })
    if (query.id) {
      this.setState({ pending: true })
      fetchSection({ id: query.id }, section => {
        fetchTopics({
          id: section.foreign_id
        }, topics => this.setState({
          section, pending: false, currentStep: 1,
          topics,
          tempTopics: topics,
          topicList: topics.topic_list,
          topic_num: topics.topic_sum
        }), error => message.error(error))
      }, error => message.error(error))
    } else if (query.tid > 0) {
      buyTopics({
        organize_id: this.props.query.oid,
        lesson_id: this.props.query.lid,
        id: query.tid
      }, () => {
        this.props.fetchTopics({ id: query.tid }, topics => {
          this.setState({ visible: false, currentStep: 1, tempTopics: topics, topicList: topics.topic_list, topic_num: topics.topic_list.length })
        }, error => {
          message.error(error)
        })
      }, error => {
        message.error(error)
      })
    }
  }
  handleNext = step => this.setState({ currentStep: step })
  clickHandler = topics => {
    if (this.state.tempTopics.id === topics.id) {
      message.warn('该试题已经引用！')
      this.setState({ currentStep:1 })
    } else {
     this.setState({ visible: true, tempTopics: topics })
    }
  }
  okHandler = () => {
    this.setState({ confirmLoading: true })
    this.props.buyTopics({
      organize_id: this.props.query.oid,
      lesson_id: this.props.query.lid,
      id: this.state.tempTopics.id
    }, () => {
      this.props.fetchTopics({ id: this.state.tempTopics.id }, topics => {
        message.success('引用成功')
        this.setState({ visible: false, currentStep: 1, confirmLoading: false, topicList: topics.topic_list, topic_num: topics.topic_list.length })
      }, error => {
        this.setState({ confirmLoading: false })
        message.error(error)
      })
    }, error => {
      message.error(error)
    })
  }
  cancelHandler = () => {
    this.setState({ visible: false, tempTopics: this.state.topics })
  }
  remove = id => {
    if (this.state.topicList.length === 1) {
      return message.warn('至少要有一个试题!', 6)
    }
    this.setState({ topicList: this.state.topicList.filter(i => i.id != id)})
  }
  submitHandler = state => {
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (this.state.tempTopics.id === undefined) {
        message.error('请选择试题', 6)
        return
      }
      const { section, tempTopics, topicList } = this.state
      const { query, addSection, editSection } = this.props
      if (state === 0) {
        if (section.id === undefined) {
          addSection({
            title: values.title,
            descript: values.descript || '',
            state: 2,//1:正常,2:冻结,3:删除
            category_id: TOPICS,
            foreign_id: tempTopics.id,
            lesson_id: query.lid,
            organize_id: query.oid,
            topic_num: values.topic_num,
            topic_id_list: topicList.map(i => i.id).toString()
          }, id => {
            message.success('保存到课程资源库', 6)
            this.setState({ section: { id } })
          }, error => message.error(error, 8))
        } else {
          editSection({
            id: this.state.section.id,
            title: values.title,
            topic_num: values.topic_num,
            topic_id_list: topicList.map(i => i.id).toString(),
            descript: values.descript || ''
          }, () => message.success('保存成功!'), error => message.error(error))
        }
      } else if (state === 1) {
        if (query.edit === '1') {
          if (section.id === undefined) return message.error('url参数错误')
          editSection({
            id: section.id,
            title: values.title,
            topic_num: values.topic_num,
            topic_id_list: topicList.map(i => i.id).toString(),
            descript: values.descript || ''
          }, () => message.success('编辑成功!'), error => message.error(error))
        } else {
          addSection({
            title: values.title,
            topic_num: values.topic_num,
            descript: values.descript || '',
            state: 1,
            category_id: TOPICS,
            foreign_id: tempTopics.id,
            lesson_id: query.lid,
            organize_id: query.oid,
            topic_id_list: topicList.map(i => i.id).toString()
          }, () => {
            message.success('创建成功!')
            if (query.lid > 0) {
              this.props.redirct(`/lesson/section?lid=${query.lid}&oid=0`)
            } else {
              this.props.redirct(`/organize/section?oid=${query.oid}&lid=0`)
            }
          }, error => message.error(error, 8))
        }
      }
    })
  }
  render() {
    const { currentStep, total, myTotal, visible, tempTopics, confirmLoading, section, topicList, topic_num } = this.state
    const { loading, list, myList, changeHandler, userId, query } = this.props
    if (!query.oid || !query.lid) {
      return (<div>参数错误</div>)
    }
    const sale_amount = tempTopics && tempTopics.sale_amount/100
    const { getFieldDecorator } = this.props.form
    const columns2 = [{
      title: '试题',
      dataIndex: 'question',
      key: 'question',
      width: '80%'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => <Button onClick={() => this.remove(record.id)}>删除</Button>
    }]
    const columns = [{
      dataIndex: 'title',
      key: 'title',
      title: '试卷标题'
    }, {
      dataIndex: 'sale_amount',
      key: 'sale_amount',
      title: '价格',
      render: text => `${text/100}元`
    }, {
      key: 'operation',
      title: '选择',
      render: (text, record) => <Button onClick={() => this.clickHandler(record) }>引用</Button>
    }]
    const pagination = {
      showSizeChanger: true,
      total: topicList.length,
      showTotal: total => `共 ${total} 条`
    }
    return (
        <div>
          <Modal title="购买试卷" visible={visible} confirmLoading = {confirmLoading} maskClosable={false}
                 onOk={this.okHandler} onCancel={this.cancelHandler}
          >
            <div style={{textAlign: 'center'}}>
              <p>试卷名称：{tempTopics.title}</p>
              <p>试卷价格：<em style={{color:'orange', fontSize:'200%'}}>{sale_amount}</em>元</p>
            </div>
          </Modal>
          {
            query.oid > 0 ?
            <OrganizeBar organize={this.props.organize} /> :
            <LessonBar lid={ query.lid } current='' />
          }
          <Steps current={currentStep}>
            <Step title="选择试卷"/>
            <Step title="文章基本信息"/>
          </Steps>
          { currentStep === 0 ?
            <div>
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
              </Tabs>
              <Button onClick={()=>this.handleNext(1)}>下一步</Button>
            </div>
            :null
          }
          {
            currentStep === 1 ?
              <Spin spinning={loading}>
                <Form horizontal>
                  <FormItem hasFeedback {...formItemLayout} label="文章标题">
                    {getFieldDecorator('title', {
                      rules: [{
                        required: true, whitespace: false, message: '请填写文章标题'
                      }],
                      initialValue: section.title
                    })(<Input type='text' />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label='出试题数' help={`最大题数：${topic_num}`}>
                    {getFieldDecorator('topic_num', {
                      rules: [{
                        required: true, message: '请填写出试题数'
                      }, {
                        validator: (rule, value, callback) => {
                          if (value <= 0) {
                            callback('题数必须大于0')
                          } else if(value > topic_num) {
                            callback(`题数不能大于${topic_num}`)
                          } else {
                            callback()
                          }
                        }
                      }],
                      initialValue: section.topic_num
                    })(<Input type='number' />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="试题列表">
                    <Table pagination={pagination} dataSource={this.state.topicList} columns={columns2} bordered>
                    </Table>
                  </FormItem>
                  <FormItem {...formItemLayout} label="文章描述">
                    {getFieldDecorator('descript',{
                      initialValue: section.descript
                    })(<Input type="textarea" rows={5} />)}
                  </FormItem>
                  <FormItem wrapperCol={{ offset: 6 }}>
                    <Button style={{marginRight: 30}} onClick={()=>this.handleNext(0)}>上一步</Button>
                    { query.edit === '1' ? null:
                      <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到草稿箱</Button>
                    }
                    <Button type='primary' onClick={() => this.submitHandler(1)}>保存并发布</Button>
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
  // userId: PropTypes.number.isRequired,
  buyTopics: PropTypes.func.isRequired,
  query: PropTypes.object.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  fetchSection: PropTypes.func.isRequired
}

export default connect(
  state => ({
    list: state.topics.list,
    myList: state.topics.myList,
    loading: state.section.loading,
    userId: state.auth.key,
    query: state.routing.locationBeforeTransitions.query,
    organize: state.organize.entity
  }),
  dispatch => ({
    redirct: path => dispatch(push(path)),
    fetchSection: (params, resolve, reject) => {
      dispatch({
        type: 'section/get',
        payload: {
          params, resolve, reject
        }
      })
    },
    fetchTopics: (params, resolve, reject) => {
      dispatch({
        type: 'topics/get',
        payload: {
          params, resolve, reject
        }
      })
    },
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
          params, resolve, reject
        }
      })
    },
    editSection: (params, resolve, reject) => {
      dispatch({
        type: 'section/edit',
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
            params: {...params, state: 1 }, reject: error => message.error(error)
          }
        })
      } else {
        dispatch({
          type: 'topics/list',
          payload: {
            params: { ...params, state: 1 }, reject: error => message.error(error)
          }
        })
      }
    }
  })
)(Form.create()(AddTextPaper))
