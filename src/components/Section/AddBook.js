/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Form, Spin,Input, Button, Tabs, Steps, Row, Col, Pagination, Modal, message } from 'antd'
import SelectYunbook from '../Yunbook/SelectYunbook'
import EditLblView from '../Yunbook/EditLblView'
import { BOOK } from '../../constants/api'
const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem =Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
}


class AddBook extends Component {
  state = {
    section: {},
    currentStep: 0,
    show: false,
    yunbook: {},
    pending: false,
    lbl: null,
    confirmLoading: false
  }
  componentWillMount() {
    this.props.getInfo({ account_id: this.props.userId })
    this.props.getInfo({})
    this.props.changeHandler({ offset: 1, limit: 6 })
    this.props.changeHandler({ offset: 1, limit: 6, account_id: this.props.userId })
    /*当从预览跳转时有yid
     *当编辑状态时有id
     *yid和id不会共存
     */
    if (this.props.query.id) {
      this.setState({ pending: true })
      this.props.fetchSection({ id: this.props.query.id }, section => {
        this.setState({ section, pending: false })
      }, error => message.error(error))
    } else if (this.props.query.yid) {
      this.setState({ pending: true })
      this.props.fetchYunbook({ id: this.props.query.yid }, yunbook => {
          this.setState({ yunbook, currentStep: 1, pending: false })
      }, error => message.error(error))
    }
  }
  changeLblHandler = lbl => {
    this.setState({ lbl })
  }
  handlePick= yunbook => {
    if (this.state.yunbook.id === yunbook.id){
      this.setState({ currentStep: 2 })
      message.info('云板书已经被引用', 6)
    } else{
      if (this.state.lbl) {
        yunbook.lbl = this.state.lbl
      }
      this.setState({ yunbook, show: true })
    }
  }
  handleNext = step => {
    this.setState({ currentStep:step })
  }
  okHandler = () => {
    this.setState({ confirmLoading: true })
    this.props.buyBook({
      id: this.state.yunbook.id,
      organize_id: this.props.query.oid,
      lesson_id: this.props.query.lid
    }, () => {
      message.success('引用成功')
      this.setState({ show: false, currentStep: 1, confirmLoading: false })
    }, error => {
      this.setState({ confirmLoading: false })
      message.error(error)
    })
  }
  cancelHandler = () => {
    this.setState({ show: false, yunbook: {} })
  }
  submitHandler = state => {
    //state 0 保存到草稿 1 保存并发布
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      if (this.state.yunbook.id === undefined) {
        message.error('缺少参数')
        return
      }
      if (state === 0) {
        if (this.state.section.id === undefined) {
          this.props.addSection({
            title: values.title,
            descript: values.descript || '',
            state: 2,//1:正常,2:冻结,3:删除
            category_id: BOOK,
            foreign_id: this.state.yunbook.id,
            lesson_id: this.props.query.lid,
            organize_id: this.props.query.oid,
            lbl: this.state.lbl
          }, id => {
            message.success('保存到素材', 6)
            this.setState({ section: { id } })
          }, error => message.error(error, 8))
        } else {
          this.props.editSection({
            id: this.state.section.id,
            title: values.title,
            descript: values.descript || '',
            lbl: this.state.lbl
          }, () => message.success('保存成功!'), error => message.error(error))
        }
      } else if (state === 1) {
        if (this.props.query.edit === 1) {
          if (this.section.id === undefined) return message.error('url参数错误')
          this.props.editSection({
            id: this.state.section.id,
            title: values.title,
            descript: values.descript || '',
            lbl: this.state.lbl
          }, () => message.success('编辑成功!'), error => message.error(error))
        } else {   
          this.props.addSection({
            title: values.title,
            descript: values.descript || '',
            state: 1,
            category_id: BOOK,
            foreign_id: this.state.yunbook.id,
            lesson_id: this.props.query.lid,
            organize_id: this.props.query.oid,
            lbl: this.state.lbl
          }, id => {
            message.success('创建成功!')
            this.props.redirct(`/section/show/${id}`)
          }, error => message.error(error, 8))
        }
      }
    })
  }
  render() {
    const { loading, bookList, myBookList, query, total, myTotal, changeHandler, userId } = this.props
    const { getFieldProps } = this.props.form
    const { currentStep, show, yunbook, pending, confirmLoading } = this.state
    if (!query.oid || !query.lid) {
     return (<div>参数错误</div>)
    }
    return (
      <div>
        <Spin spinning={pending}>
        <Modal title="购买云板书" visible={show} confirmLoading={confirmLoading} maskClosable={false}
               onOk={this.okHandler} onCancel={this.cancelHandler}
        >
          <div style={{textAlign: 'center'}}>
            <p>云板书名称：{yunbook && yunbook.title}</p>
            <p>云板书价格：<em style={{color:'orange',fontSize:'200%'}}>{yunbook && yunbook.sale_amount}</em>元</p>
          </div>
        </Modal>
        <Steps current={ currentStep }>
          <Step title='选择云板书'/>
          <Step title='添加标注'/>
          <Step title='文章基本信息'/>
        </Steps>
        { currentStep === 2 ?
        <Spin spinning={loading}>
          <Form horizontal>
            <FormItem {...formItemLayout} hasFeedback label="文章标题">
              <Input {...getFieldProps('title', {
                rules: [{
                  required: true,
                  whitespace: false,
                  message: '请填写标题'
                }]
              })}/>
              </FormItem>
            <FormItem {...formItemLayout} label="文章描述">
                <Input type="textarea" rows={5} {...getFieldProps('descript')}/>
            </FormItem>
            <FormItem wrapperCol={{ offset: 6 }}>
              <Button style={{marginRight: 30}} onClick={()=>this.handleNext(1)}>上一步</Button>
              <Button style={{marginRight: 30}} onClick={() => this.submitHandler(0)}>保存到素材</Button>
              <Button type='primary' onClick={() => this.submitHandler(1)}>保存并发布</Button>
            </FormItem>
          </Form>
        </Spin> : null }
        { currentStep === 1 ?
          <div>
            <EditLblView yunbook={yunbook} changeLbl={this.changeLblHandler}/>
            <div style={{marginTop: 30}}>
              <Button style={{marginRight: 10}} onClick={()=>this.handleNext(0)}>上一步</Button>
              <Button onClick={()=>this.handleNext(2)}>下一步</Button>
            </div>
          </div> :null }
        { currentStep === 0 ?
          <Tabs>
            <TabPane tab='全部云板书' key='1'>
              <Row>
                {
                  bookList.map(yunbook=>{
                    return (<Col key={yunbook.id} span={8}>
                              <SelectYunbook
                                lid = { query.lid }
                                oid = { query.oid }
                                yunbook={ yunbook }
                                handlePick = {this.handlePick}
                              />
                            </Col>)
                  })
                }
              </Row>
              { total > 0 ?
                <div className='pagination'>
                  <Pagination
                    total={total}
                    showTotal={total => `共 ${total} 条`}
                    pageSize = {6}
                    onChange = { page => this.changeHandler({ offset: page, limit:6 })}
                  />
                </div> :
                <p style={{textAlign: 'center'}}>暂无数据</p>
              }
            </TabPane>
            <TabPane tab='我的云板书' key='2'>
              <Row gutter={8}>
                {
                  myBookList.map(yunbook=>{
                    return (
                      <Col key={yunbook.id} span={8}>
                        <SelectYunbook
                          lid = {query.lid}
                          oid = {query.oid}
                          yunbook={yunbook}
                          handlePick = {this.handlePick}
                        />
                      </Col>
                    )
                  })
                }
              </Row>
              {myTotal > 0 ?
                <div className='pagination'>
                  <Pagination
                    total={myTotal}
                    showTotal={total => `共 ${total} 条`}
                    pageSize = {6}
                    onChange = { page => changeHandler({ offset: page, limit: 6, account_id: userId })}
                  />
                </div> :
                <p style={{textAlign: 'center'}}>暂无数据</p>
              }
              <Button disabled = { yunbook.id === undefined } onClick={()=>this.handleNext(1)}>下一步</Button>
            </TabPane>
          </Tabs> :null
        }
        </Spin>
      </div>
    )
  }
}

AddBook.propTypes = {
  loading: PropTypes.bool.isRequired,
  bookList: PropTypes.array.isRequired,
  myBookList: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  myTotal: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  getInfo: PropTypes.func.isRequired,
  fetchYunbook: PropTypes.func.isRequired,
  addSection: PropTypes.func.isRequired,
  buyBook: PropTypes.func.isRequired
}

export default connect(
  state => ({
    loading: state.section.loading,
    bookList: state.yunbook.list,
    myBookList: state.yunbook.mylist,
    userId: state.auth.key,
    query: state.routing.locationBeforeTransitions.query,
    total: state.yunbook.total,
    myTotal: state.yunbook.myTotal,
  }),
  dispatch => ({
    redirct: path => {
      dispatch(push(path))
    },
    changeHandler: params => {
      if (params.account_id) {
        dispatch({ type: 'yunbook/mylist', payload : params })
      } else {
        dispatch({ type: 'yunbook/list', payload: params })
      }
    },
    getInfo: params => {
      if (params.account_id) {
        dispatch({ type : 'yunbook/myinfo', payload : params })
      } else {
        dispatch({ type: 'yunbook/info', payload: params })
      }
    },
    fetchYunbook: (params, resolve, reject) => {
      dispatch({ type: 'yunbook/fetch', payload: params, meta: {
        resolve, reject
      }})
    },
    fetchSection: (params, resolve, reject) => {
      dispatch({ type: 'section/get', payload: {
        params, resolve, reject
      }})
    },
    addSection: (params, resolve, reject) => {
      dispatch({ type: 'section/add', payload: {
        params, resolve, reject
      }})
    },
    editSection: (params, resolve, reject) => {
      dispatch({ type: 'section/edit', payload: {
        params, resolve, reject
      }})
    },
    buyBook: (params, resolve, reject) => {
      dispatch({ type: 'yunbook/buy', payload: {
        params, resolve, reject
      }})
    }
  })
)(Form.create()(AddBook))

