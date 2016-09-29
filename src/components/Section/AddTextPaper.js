/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Spin, Form, Steps, Table, message, Input, Tabs, Button, Modal } from 'antd'
import { TOPICS } from '../../constants/api'
import LessonBar from '../Lesson/LessonBar'
import Paper from '../Paper'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}


class AddTextPaper extends Component {
  state = {
    currentStep: 0,
    total: 0,
    myTotal: 0,
    topics: {},
    tempTopics: {},
    visible: false,
    section: {},
    confirmLoading: false
  }
  componentWillMount() {
    const { getInfo, changeHandler, query, fetchSection, fetchTopics, getLesson  } = this.props
    //获取分页信息
    getInfo({}, total => this.setState({ total }), error => message.error(error))
    getInfo({ account_id: this.props.userId }, total => this.setState({ myTotal: total }), error => message.error(error))
    changeHandler({ offset: 1, limit: 9 })
    changeHandler({ offset: 1, limit: 9, account_id: this.props.userId })
    getLesson({ id: query.lid })
    if (query.id) {
      this.setState({ pending: true })
      fetchSection({ id: query.id }, section => {
        fetchTopics({
          id: section.foreign_id
        }, topics => this.setState({
<<<<<<< Updated upstream
          section, pending: false, currentStep: 1, 
          topics,
          tempTopics: topics 
=======
          section, pending: false, currentStep: 1,
          topics,
          tempTopics: topics
>>>>>>> Stashed changes
        }), error => message.error(error))
      }, error => message.error(error))
    }
  }
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
      message.success('引用成功')
      this.setState({ visible: false, currentStep: 1, confirmLoading: false })
    }, error => {
      this.setState({ confirmLoading: false })
      message.error(error)
    })
  }
  cancelHandler = () => {
    this.setState({ visible: false, tempTopics: this.state.topics })
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
      const { section, tempTopics } = this.state
      const { query, addSection, editSection } = this.props
      if (state === 0) {
        if (section.id === undefined) {
          addSection({
            title: values.title,
            descript: values.descript || '',
            state: 1,//1:正常,2:冻结,3:删除
            category_id: TOPICS,
            foreign_id: tempTopics.id,
            lesson_id: query.lid,
            organize_id: query.oid,
            topic_num: values.topic_num
          }, id => {
            message.success('保存到素材', 6)
            this.setState({ section: { id } })
          }, error => message.error(error, 8))
        } else {
          editSection({
            id: this.state.section.id,
            title: values.title,
            topic_num: values.topic_num,
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
            descript: values.descript || ''
          }, () => message.success('编辑成功!'), error => message.error(error))
<<<<<<< Updated upstream
        } else {   
=======
        } else {
>>>>>>> Stashed changes
          addSection({
            title: values.title,
            topic_num: values.topic_num,
            descript: values.descript || '',
            state: 1,
            category_id: TOPICS,
            foreign_id: tempTopics.id,
            lesson_id: query.lid,
            organize_id: query.oid,
          }, () => {
            message.success('创建成功!')
            if (query.lid > 0) {
              this.props.redirct(`/lesson/show/${query.lid}`)
            } else {
              this.props.redirct(`/organize/show/${query.oid}`)
            }
          }, error => message.error(error, 8))
        }
      }
    })
<<<<<<< Updated upstream
    
=======

>>>>>>> Stashed changes
  }
  render() {
    const { currentStep, total, myTotal, visible, tempTopics, confirmLoading } = this.state
    const { loading, list, myList, changeHandler, userId, query, lesson } = this.props
    if (!query.oid || !query.lid) {
      return (<div>参数错误</div>)
    }
<<<<<<< Updated upstream
    const { getFieldProps } = this.props.form
=======
    const { getFieldDecorator } = this.props.form
>>>>>>> Stashed changes
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
    return (
        <div>
          <Modal title="购买试卷" visible={visible} confirmLoading = {confirmLoading} maskClosable={false}
                 onOk={this.okHandler} onCancel={this.cancelHandler}
          >
            <div style={{textAlign: 'center'}}>
              <p>试卷名称：{tempTopics.title}</p>
              <p>试卷价格：<em style={{color:'orange',fontSize:'200%'}}>{tempTopics.sale_amount/100}</em>元</p>
            </div>
          </Modal>
           <Paper>
              <div style={{margin: '10px 0'}}>
                  <LessonBar lesson={ lesson } current='' />
              </div>
          </Paper>
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
                <Form horizontal>
                  <FormItem hasFeedback {...formItemLayout} label="文章标题">
<<<<<<< Updated upstream
                    <Input type='text' {...getFieldProps('title', {
                      rules: [{
                        required: true, whitespace: false, message: '请填写文章标题'
                      }]
                    })}/>          
                  </FormItem>
                  <FormItem {...formItemLayout} label='出试题数'>
                    <Input type='number' {...getFieldProps('topic_num', {
=======
                    <Input type='text' {...getFieldDecorator('title', {
                      rules: [{
                        required: true, whitespace: false, message: '请填写文章标题'
                      }]
                    })}/>
                  </FormItem>
                  <FormItem {...formItemLayout} label='出试题数'>
                    <Input type='number' {...getFieldDecorator('topic_num', {
>>>>>>> Stashed changes
                      rules: [{
                        required: true, message: '请填写出试题数'
                      }, {
                        validator: (rule, value, callback) => {
                          if (value <= 0) {
                            callback('题数必须大于0')
                          } else {
                            callback()
                          }
                        }
                      }]
                    })}/>
                  </FormItem>
                  <FormItem {...formItemLayout} label="文章描述">
<<<<<<< Updated upstream
                    <Input type="textarea" rows={5} {...getFieldProps('descript')} />
=======
                    <Input type="textarea" rows={5} {...getFieldDecorator('descript')} />
>>>>>>> Stashed changes
                  </FormItem>
                  <FormItem wrapperCol={{ offset: 6 }}>
                    <Button style={{marginRight: 30}} onClick={()=>this.handleNext(0)}>上一步</Button>
                    { query.edit === '1' ? null:
                      <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到素材</Button>
                    }
                    <Button type='primary' onClick={() => this.submitHandler(1)}>保存并发布</Button>
                  </FormItem>
<<<<<<< Updated upstream
                </Form>        
=======
                </Form>
>>>>>>> Stashed changes
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
  query: PropTypes.object.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  fetchSection: PropTypes.func.isRequired,
  getLesson: PropTypes.func.isRequired
}

export default connect(
  state => ({
    list: state.topics.list,
    myList: state.topics.myList,
    loading: state.section.loading,
    userId: state.auth.key,
    query: state.routing.locationBeforeTransitions.query,
    lesson: state.lesson.entity
  }),
  dispatch => ({
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
    getLesson: (params, resolve, reject) => dispatch({
        type: 'lesson/get',
        payload: params, resolve, reject
    }),
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
