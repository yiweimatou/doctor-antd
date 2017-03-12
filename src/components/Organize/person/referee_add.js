import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import UserSelector from '../../User/selector'
import { isMobile } from '../../../utils'
import organize_referee from '../../../services/organize_referee'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class RefereeAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      userId: 0
    }
  }
  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      if (!this.state.userId) {
        return message.error('请选择用户')
      }
      const params = {
        account_id: this.state.userId,
        cname: values.cname,
        mobile: values.mobile,
        remark: values.remark ? values.remark: '',
        saler_role: 2,
        doctor_role: 2,
        organize_id: this.props.id
      }
      organize_referee.add(params).then(data => {
        this.props.form.resetFields()
        this.props.addResolve({
          ...params,
          id: data.indentity
        })
      }).catch(err => message.error(err))
    })
  }

  selectHandler = user => {
    this.props.form.setFieldsValue({
      cname: user.cname,
      mobile: user.mobile
    })
    this.setState({
      userId: user.id,
      visible: false
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.submitHandler}>
        <FormItem label="选择用户" required {...formItemLayout}>
          <Button onClick={() => this.setState({ visible: true })}>选择用户</Button>
          <UserSelector selectHandler={this.selectHandler} visible={this.state.visible} cancelHandler={() => this.setState({ visible: false })}/>
        </FormItem>
        <FormItem label="姓名" required {...formItemLayout}>
          {getFieldDecorator('cname', {
            rules: [
              { required: true, message: '姓名不能为空' }
            ]
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
            ]
          })(<Input type="text" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark')(<Input type="textarea" />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(RefereeAdd)