import React, { Component } from 'react'
import {
  Form, Input, Button, message
} from 'antd'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
class edit extends Component {
  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
        if (errors) return
        const params = {
          id: this.props.item.id,
          title: values.title,
          descript: values.descript
        }
        this.props.edit(params).then(() => this.props.afterEdit(params)).catch(err => message.error(err))
    })
  }
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form onSubmit={this.submitHandler}>
        <FormItem {...formItemLayout} label='视频素材名称' hasFeedback>
            {getFieldDecorator('title', {
                rules: [{
                    required: true,
                    whitespace: true,
                    message: '请填写名称'
                }],
                initialValue: this.props.item.title
            })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label='说明'>
            {getFieldDecorator('descript', {
                initialValue: this.props.item.descript
            })(<Input type='textarea' rows={5}/>)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }}>
            <Button type="primary" htmlType="submit">保存至个人素材库</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(edit)