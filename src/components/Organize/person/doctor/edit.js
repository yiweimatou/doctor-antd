import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { isMobile } from '../../../../utils'
import RefereeSelect from '../referee_select'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class DoctorEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      referee_account_id: 0,
      referee_cname: ''
    }
  }

  componentWillMount() {
    this.setState({
      referee_account_id: this.props.doctor.referee_account_id,
      referee_cname: this.props.doctor.referee_cname
    })
  }
  
  onSelect = referee => {
    this.setState({
      referee_cname: referee.cname,
      referee_account_id: referee.account_id,
      visible:false
    })
  }

  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      const params = {
        id: this.props.doctor.id,
        cname: values.cname,
        unit: values.unit,
        dept: values.dept,
        duty: values.duty,
        rank: values.rank,
        remark: values.remark ? values.remark : '',
        mobile: values.mobile,
        referee_cname: this.state.referee_cname,
        referee_account_id: this.state.referee_account_id
      }
      this.props.edit(params).then(() => {
        this.props.form.resetFields()
      })
    })
  }
  render() {
    const { doctor } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.submitHandler}>
        <FormItem label="医药代表" {...formItemLayout}>
          <span style={{ marginRight: 10 }}>{this.state.referee_cname}</span>
          <Button onClick={this.visibleToggle}>更换医药代表</Button>
          <RefereeSelect 
            visible={this.state.visible}
            onSelect={this.onSelect}
            onCancel={this.visibleToggle}
            id={doctor.organize_id}
          />
        </FormItem>
        <FormItem label="姓名" {...formItemLayout}>
          {getFieldDecorator('cname', {
            rules: [
              { required: true, message: '姓名不能为空' }
            ],
            initialValue: doctor.cname
          })(<Input type="text" />)}
        </FormItem>
        <FormItem label="单位" {...formItemLayout}>
          {getFieldDecorator('unit', {initialValue: doctor.unit})(<Input type="text" />)}
        </FormItem>
        <FormItem label="科室" {...formItemLayout}>
          {getFieldDecorator('dept', {initialValue: doctor.dept})(<Input type="text" />)}
        </FormItem>
        <FormItem label="职务" {...formItemLayout}>
          {getFieldDecorator('duty', {initialValue: doctor.duty})(<Input type="text" />)}
        </FormItem>
        <FormItem label="职称" {...formItemLayout}>
          {getFieldDecorator('rank', {initialValue: doctor.rank})(<Input type="text" />)}
        </FormItem>
        <FormItem label="手机号码" {...formItemLayout}>
          {getFieldDecorator('mobile', {
            rules: [
              { validator: (rule, value, callback) => {
                if (value) {
                  if (isMobile(value)) {
                    callback()
                  } else {
                    callback('请填写正确的手机号码!')
                  }
                }
              }}
            ],
            initialValue: doctor.mobile
          })(<Input type="text" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('remark', { initialValue: doctor.remark })(<Input type="textarea" />)}
        </FormItem>
        <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(DoctorEdit)