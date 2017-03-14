import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { isMobile } from '../../../utils'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class RefereeEdit extends Component {

  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      this.props.edit({
        id: this.props.referee.id,
        cname: values.cname,
        mobile: values.mobile,
        remark: values.remark ? values.remark: ''
      }).then(() => {
        this.props.form.resetFields()
      }).catch(err => message.error(err))
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { referee } = this.props
    return (
      <Form onSubmit={this.submitHandler}>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('cname', {
            rules: [
              { required: true, message: '姓名不能为空' }
            ],
            initialValue: referee.cname
          })(<Input type="text" />)}
        </FormItem>
        <FormItem label="手机号码" required {...formItemLayout}>
          {getFieldDecorator('mobile', {
            rules: [
              { validator: (rule, value, callback) => {
                if (value) {
                  if (isMobile(value)) {
                    callback()
                  } else {
                    callback('请填写正确的手机号码!')
                  }
                } else {
                  callback('请填写手机号码')
                }
              }}
            ],
            initialValue: referee.mobile
          })(<Input type="text" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', { initialValue: referee.remark })(<Input type="textarea" />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(RefereeEdit)