import React, { Component } from 'react'
import { Form, Spin, InputNumber, Button, message } from 'antd'
import organize_product from '../../../services/organize_product'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class ProductSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }
  submitHandler = e => {
    e.preventDefault()
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      const product = {
        id: this.props.product.id,
        referee_amount: values.referee_amount * 100,
        doctor_amount: values.doctor_amount * 100,
        saler_amount: values.saler_amount * 100,
        customer_amount: values.customer_amount * 100,
        rcmd_customer_amount: values.rcmd_customer_amount * 100,
        favorable_amount: values.favorable_amount * 100
      }
      this.setState({ loading: true })
      organize_product.edit(product).then(() => {
        message.success('保存成功!')
        this.setState({ loading: false })
      }).catch(err => {
        message.error(err)
        this.setState({ loading: false })
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form 
    const { product } = this.props
    return (
      <Spin tip="提交中，请等待..." spinning={this.state.loading}>
        <Form onSubmit={this.submitHandler}>
          <FormItem label="医药代表分成" {...formItemLayout}>
            {getFieldDecorator('referee_amount', {
              initialValue: product.referee_amount ? product.referee_amount / 100 : 0
            })(<InputNumber formatter={v => `${v} 元`} style={{ width: '100%' }} min={0} max={200} />)}
          </FormItem>
          <FormItem label="医生分成" {...formItemLayout}>
            {getFieldDecorator('doctor_amount', {
              initialValue: product.doctor_amount ? product.doctor_amount / 100 : 0
            })(<InputNumber min={0} max={200} formatter={v => `${v} 元`} style={{ width: '100%' }}/>)}
          </FormItem>
          <FormItem label="销售分成" {...formItemLayout}>
            {getFieldDecorator('saler_amount', {
              initialValue: product.saler_amount ? product.saler_amount / 100 : 0
            })(<InputNumber min={0} max={200} formatter={v => `${v} 元`} style={{ width: '100%' }}/>)}
          </FormItem>
          <FormItem label="消费者分成" {...formItemLayout}>
            {getFieldDecorator('customer_amount', {
              initialValue: product.customer_amount? product.customer_amount / 100 : 0
            })(<InputNumber min={0} max={200} formatter={v => `${v} 元`} style={{ width: '100%' }}/>)}
          </FormItem>
          <FormItem label="消费者上级分成" {...formItemLayout}>
            {getFieldDecorator('rcmd_customer_amount', {
              initialValue: product.rcmd_customer_amount ? product.rcmd_customer_amount / 100 : 0
            })(<InputNumber min={0} max={200} formatter={v => `${v} 元`} style={{ width: '100%' }}/>)}
          </FormItem>
          <FormItem label="签到红包" {...formItemLayout}>
            {getFieldDecorator('favorable_amount', {
              initialValue: product.favorable_amount ? product.favorable_amount / 100 : 0
            })(<InputNumber min={0} max={200} formatter={v => `${v} 元`} style={{ width: '100%' }}/>)}
          </FormItem>
          <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit">保存设置</Button>
          </FormItem>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ProductSetting)