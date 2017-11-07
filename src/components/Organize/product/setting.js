import React, { Component } from 'react'
import { Form, Spin, Button, message, Input } from 'antd'
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
        favorable_amount: values.favorable_amount * 100,
		rcmd1_percent: values.rcmd1_percent,
		rcmd2_percent: values.rcmd2_percent,
		redpack_percent: values.redpack_percent,
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
				<div style={{ display: 'flex '}}>
					<div style={{ flex: '1 1 auto' }}>
						<h3 style={{ textAlign: 'center', marginBottom: 20 }}>二维码红包</h3>
						<FormItem label="医药代表分成" {...formItemLayout}>
							{getFieldDecorator('referee_amount', {
								initialValue: product.referee_amount ? product.referee_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
						<FormItem label="医生分成" {...formItemLayout}>
							{getFieldDecorator('doctor_amount', {
								initialValue: product.doctor_amount ? product.doctor_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
						<FormItem label="销售分成" {...formItemLayout}>
							{getFieldDecorator('saler_amount', {
								initialValue: product.saler_amount ? product.saler_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
						<FormItem label="消费者分成" {...formItemLayout}>
							{getFieldDecorator('customer_amount', {
								initialValue: product.customer_amount? product.customer_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
						<FormItem label="消费者上级分成" {...formItemLayout}>
							{getFieldDecorator('rcmd_customer_amount', {
								initialValue: product.rcmd_customer_amount ? product.rcmd_customer_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
						<FormItem label="签到红包" {...formItemLayout}>
							{getFieldDecorator('favorable_amount', {
								initialValue: product.favorable_amount ? product.favorable_amount / 100 : 0,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											if (isNaN(parseInt(value))) {
												return callback('请填写数字')
											} else if (value < 0 || value > 200) {
												return callback('请填写大于0且小于200的金额')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="元" />)}
						</FormItem>
					</div>
					<div style={{ flex: '1 1 auto', alignSelf: 'center' }}>
						<h3 style={{ textAlign: 'center', marginBottom: 20 }}>商场分成</h3>
						<FormItem label="一级推销员分成" {...formItemLayout}>
							{getFieldDecorator('rcmd1_percent', {
								initialValue: product.rcmd1_percent,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											const num = parseInt(value)
											if (isNaN(num) || Math.floor(num) !== num) {
												return callback('请填写整数')
											} else if (num < 0 || num > 100) {
												return callback('请填写大于0且小于100的百分比')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="%" />)}
						</FormItem>
						<FormItem label="二级推销员分成" {...formItemLayout}>
							{getFieldDecorator('rcmd2_percent', {
								initialValue: product.rcmd2_percent,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											const num = parseInt(value)
											if (isNaN(num) || Math.floor(num) !== num) {
												return callback('请填写整数')
											} else if (num < 0 || num > 100) {
												return callback('请填写大于0且小于100的百分比')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="%" />)}
						</FormItem>
						<FormItem label="红包分成" {...formItemLayout}>
							{getFieldDecorator('redpack_percent', {
								initialValue: product.redpack_percent,
								rules: [
									{ validator: (rule, value, callback) => {
										if (value) {
											const num = parseInt(value)
											if (isNaN(num) || Math.floor(num) !== num) {
												return callback('请填写整数')
											} else if (num < 0 || num > 100) {
												return callback('请填写大于0且小于100的百分比')
											}
											callback()
										} else {
											callback()
										}
									} }
								]
							})(<Input addonAfter="%" />)}
						</FormItem>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button type="primary" size="large" htmlType="submit">保存设置</Button>
				</div>
			</Form>
		</Spin>
    )
  }
}

export default Form.create()(ProductSetting)