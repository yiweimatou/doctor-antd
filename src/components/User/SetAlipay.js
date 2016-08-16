import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import {
    Form,Button,Input, Spin
} from 'antd'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
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
        e.preventDefault()        
        this.setState({
            disabled: true,
            vcodeLabel: 60
        })
        this.props.sendCode(this.props.user.mobile).then(() => {
            if( this.props.user.captcha.isSuccess ){
                 this.interval = setInterval(this.tick,1000)            
            }else {
                this.setState({
                    disabled: false,
                    vcodeLabel: '获取验证码'
                })
            }
        },() => {
            this.setState({
                disabled: false,
                vcodeLabel: '获取验证码'
            })
        })
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
        const { form,user } = this.props
        const { getFieldProps } = form
        return (
            <Spin spinning = {user.loading}>
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
                            }],
                            initialValue: user.alipay
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
    sendCode: PropTypes.func.isRequired
}

export default connect(
    state => ({    
        user: {
            alipay: state.auth.user.alipay,
            mobile: state.auth.user.mobile,
            captcha: state.user.captcha,
            loading: state.user.loading
        }
    }),
    dispatch => ({
        submit: params => dispatch({
            type: 'user/alipay/set',
            payload: params
        }),
        sendCode: (mobile) => Promise.resolve(dispatch({
            type: 'captcha/send',
            payload: {
                mobile
            }
        }))
    })
)(Form.create()(SetAlipay))