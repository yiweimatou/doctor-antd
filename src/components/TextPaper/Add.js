/**
 * Created by zhangruofan on 2016/9/18.
 */
import React, { Component } from 'react'
import { Form, Spin, Input, InputNumber, Button, Table, message } from 'antd'
import Select from '../Question/Select'
import Category from '../Category'
import { TOPICS } from '../../constants/api'
import { add as grow } from '../../services/grow'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

class Add extends Component {
  state = {
    loading: false,
    topicList: [],
    category: '',
    latLng: {},
    visible: false,
    pagination: {
      showSizeChanger: true,
      total: this.props.total,
      showTotal: total => `共 ${total} 条`
    }
  }
  addQuestion = () => {
    this.setState({ visible: true })
  }
  remove = id => {
    this.setState({ topicList: this.state.topicList.filter(i => i.id !== id) })
  }
  okHandler = list => {
    this.setState({ topicList: list, visible: false, pagination: {
      ...this.state.pagination,
      totol: list.length
    } })
  }
  cancelHandler = () => {
    this.setState({ visible: false })
  }
  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (errors) return
      const category = this.state.category
      if (category.length > 0 && category.length < 3) {
          return message.error('请再选择一级分类')
      }
      let topic_id_list = ''
      if (this.state.topicList.length === 1) {
        topic_id_list = this.state.topicList[0].id
      } else if(this.state.topicList.length === 0) {
        return message.error('请选择试题', 6)
      } else {
        topic_id_list = this.state.topicList.reduce((previousValue, currentValue, index) => {
          if (index === 0) {
            return previousValue.id
          }
          if (index === 1) {
            return `${previousValue.id},${currentValue.id}`
          } else {
            return `${previousValue},${currentValue.id}`
          }
        })
      }
      this.setState({ loading: true })
      this.props.add({
        title: values.title,
        sale_amount: values.sale_amount*100,
        state: 1,
        topic_id_list
      }, record => {
        message.success('新建成功')
        this.setState({ loading: false, topicList: [] })
        if (category.length >= 3) {
          grow({
              lat: this.state.latLng.lat,
              lng: this.state.latLng.lng,
              title: values.question,
              state: 1,
              category_id: TOPICS,
              foreign_id: record.id,
              // cover: cover,
              map_id: 1,
              kind: category[0] === '1' ? category[1] : category[2]
          }, null, error => message.error(error))
        }
        this.props.form.resetFields()
        this.props.afterAddHandler(record)
      }, error => {
        message.error(error)
        this.setState({ loading: false })
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '试题',
      dataIndex: 'question',
      key: 'question',
      width: '80%'
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => <Button onClick={() => this.remove(record.id)}>删除</Button>
    }]
    return (
      <Spin spinning={this.state.loading}>
        <Select selectedIdList={this.state.topicList.map(i=>({id: i.id,question: i.question}))} visible={this.state.visible} okHandler={this.okHandler} cancelHandler={this.cancelHandler}/>
        <Form onSubmit = {this.submitHandler}>
          <FormItem {...formItemLayout} hasFeedback label="试卷标题">
                   {getFieldDecorator('title', {
                     rules: [{
                       required: true,
                       whitespace: true,
                       message: '请填写标题'
                     }]
                   })(<Input type="text" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="金额">
            {getFieldDecorator('sale_amount', {
              initialValue: 2
            })(<InputNumber min={0}/>)}
          </FormItem>
          <FormItem label = '分类' {...formItemLayout}>
            <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
          </FormItem>
          <FormItem {...formItemLayout} label="试题列表">
            <Table rowKey="id" pagination={this.state.pagination} dataSource={this.state.topicList} columns={columns} bordered title={
              () => <Button onClick={this.addQuestion}>添加试题</Button>
            }>
            </Table>
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">保存</Button>
          </FormItem>
        </Form>
      </Spin>
    )
  }
}

export default Form.create()(Add)
