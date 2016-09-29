import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import {
    Form, Button, Input, Spin, message
} from 'antd'
import { isMobile } from '../../utils'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class SetAlipay extends Component {
    state = {
        vcodeLabel: '获取验证码',
        disabled: false
    }
    tick = () => {
        if( this.state.vcodeLabel === 0){
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
    click = (e) => {
<<<<<<< Updated upstream
        e.preventDefault()     
        const mobile = this.refs.mobile.refs.input.value
        if (!isMobile(mobile)) {
            return message.error('请输入正确的手机号码')
        }      
=======
        e.preventDefault()
        const mobile = this.refs.mobile.refs.input.value
        if (!isMobile(mobile)) {
            return message.error('请输入正确的手机号码')
        }
>>>>>>> Stashed changes
        this.setState({
            disabled: true,
            vcodeLabel: 60
        })
        this.props.sendCode(mobile,() => {
<<<<<<< Updated upstream
            this.interval = setInterval(this.tick,1000)            
=======
            this.interval = setInterval(this.tick,1000)
>>>>>>> Stashed changes
        },() => {
            this.setState({
                disabled: false,
                vcodeLabel: '获取验证码'
            })
        })
    }
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
        }
    }
    submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if( errors ) return
            this.props.submit({
                alipay: values.alipay,
                vcode: values.vcode
            },() => message.success('设置成功！', 6), error => message.error(error))
        })
    }
    render() {
        const { form,user } = this.props
        const { getFieldDecorator } = form
        return (
            <Spin spinning = {user.loading}>
            <Form
                horizontal
                onSubmit = { this.submitHandler }
            >
                <FormItem
                    label='支付宝账户'
                    {...formItemLayout}
                    hasFeedback
                >
                    <Input type='text' {
                        ...getFieldDecorator('alipay',{
                            rules: [{
                                required: true,
                                message:'请填写支付宝账户'
                            }],
                            initialValue: user.alipay
                        })
                    }
                    />
                </FormItem>
                <FormItem {...formItemLayout} label="手机号码">
                    <Input type='text' ref='mobile'/>
                </FormItem>
                <FormItem
                    label='验证码'
                    {...formItemLayout}
                    hasFeedback
                    required
                >
                    <Input type='text'
                    {
                        ...getFieldDecorator('vcode',{
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
                <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button
                        disabled ={ this.state.disabled } style={{marginLeft:10}}
                        onClick = { this.click }
                    >{this.state.vcodeLabel}
                    </Button>
                </FormItem>
            </Form>
            </Spin>
        )
    }
}

SetAlipay.propTypes = {
    user: PropTypes.object,
    submit: PropTypes.func.isRequired,
    sendCode: PropTypes.func.isRequired,
    alipay: PropTypes.string,
    loading: PropTypes.bool
}

export default connect(
    state => ({
        user: {
            alipay: state.auth.user.alipay,
            mobile: state.auth.user.mobile,
            loading: state.user.loading
        }
    }),
    dispatch => ({
        submit: (params, resolve, reject) => dispatch({
            type: 'user/alipay/set',
            payload: { params, resolve, reject }
        }),
        sendCode: (mobile, resolve, reject) => dispatch({
            type: 'captcha/send',
            payload: {
                mobile
            },
            meta: {
                resolve, reject
            }
        })
    })
)(Form.create()(SetAlipay))
