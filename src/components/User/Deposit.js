import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
    Form, Button, Input, Spin, message
} from 'antd'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class Deposit extends Component {
    state = {
        vcodeLabel: '获取验证码',
        disabled: false
    }
    tick = () => {
        if (this.state.vcodeLabel === 0){
            clearInterval(this.interval)
            this.setState({
                disabled: false,
                vcodeLabel: '获取验证码'
            })
        }else {
            this.setState({
                vcodeLabel: this.state.vcodeLabel-1
            })
        }
    }
    click = e => {
        e.preventDefault()
        this.props.sendCode(this.props.user.mobile,
                () => {
                    this.setState({
                        disabled: true,
                        vcodeLabel: 60
                    })
                    message.success('验证码发送成功!')
                    this.interval = setInterval(this.tick,1000)
                },
                (error) => {
                    message.error(error)
                }
        )
    }
    submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if( errors ) return
            this.props.submit({
                amount: values.money,
                vcode: values.vcode
            }, () => message.success('提现成功'), error => message.error(error))
        })
    }
    render() {
        const { form,user } = this.props
        const { getFieldDecorator } = form
        return (
            <Spin spinning = { user.loading }>
                <Form horizontal onSubmit ={ this.submitHandler }>
                    <FormItem label = '提现金额' {...formItemLayout} hasFeedback required>
                        {getFieldDecorator('money', {
                            rules: [{
                                validator: (rule, value, callback) => {
                                    if(value && value < 100){
                                        callback('提现金额必须大于100块')
                                    }else {
                                        callback()
                                    }
                                }
                            }],
                            initialValue: 100
                        })(<Input type='text'  addonAfter='元'/>)}
                    </FormItem>
                    <FormItem
                        label='验证码'
                        {...formItemLayout}
                        hasFeedback
                        required
                    >
                        {getFieldDecorator('vcode',{
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
                            })(<Input type='text' />)
                        }
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">确定提现</Button>
                        <Button
                            disabled ={ this.state.disabled } style={{marginLeft:10}}
                            onClick = { this.click }
                        >{this.state.vcodeLabel}
                        </Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}

Deposit.propTypes = {
    user: React.PropTypes.object,
    submit: React.PropTypes.func.isRequired,
    sendCode: React.PropTypes.func.isRequired
}

export default connect(
    state => ({
        user: {
            mobile: state.auth.user.mobile,
            captcha: state.user.captcha,
            loading: state.user.loading,
            error: state.user.error
        }
    }),
    dispatch => ({
        submit: (params, resolve, reject) => dispatch({
            type: 'user/deposit',
            payload: params,
            meta: {
                resolve,
                reject
            }
        }),
        sendCode: (mobile, resolve, reject) => dispatch({
            type: 'captcha/send',
            payload: {
                mobile
            },
            meta: {
                resolve,
                reject
            }
        })
    })
)(Form.create()(Deposit))
