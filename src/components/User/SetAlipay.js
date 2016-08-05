import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import {
    Form,Button,Input
} from 'antd'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class SetAlipay extends Component {
    state = {
        vcodeLabel: '获取验证码'
    }
    submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if( errors ) return
            this.props.submit({
                alipay: values.alipay,
                vcode: values.vcode
            })
        })
    }
    render() {
        const { form } = this.props
        const { getFieldProps } = form
        return (
            <Form
                horizontal
                form = { form }
                onSubmit = { this.submitHandler }
            >
                <FormItem
                    label='支付宝账户'
                    {...formItemLayout}
                    hasFeedback
                >
                    <Input type='text' {
                        ...getFieldProps('alipay',{
                            rules: [{
                                required: true,
                                message:'请填写支付宝账户'
                            }]
                        })
                    }
                    />
                </FormItem>
                <FormItem
                    label='验证码'
                    {...formItemLayout}
                    hasFeedback
                    required
                >
                    <Input type='text'
                    {
                        ...getFieldProps('vcode',{
                            rules:[{
                                validator: (rule, value, callback) => {
                                    if(!value){
                                        return callback('请填写验证码')
                                    }
                                    if(value.length !== 4){
                                        callback('请填写正确的验证码！')
                                    }else {
                                        callback()
                                    }
                                }
                            }]
                        })
                    }
                    />
                </FormItem>
                <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button style={{marginLeft:10}}>{this.state.vcodeLabel}</Button>                
                </FormItem>
            </Form>
        )
    }
}

SetAlipay.propTypes = {
    user: PropTypes.object,
    submit: PropTypes.func.isRequired
}

export default connect(
    state => ({
        user: state.auth.user
    }),
    dispatch => ({
        submit: params => dispatch({
            type: 'user/money/setalipay',
            payload: params
        })
    })
)(Form.create()(SetAlipay))