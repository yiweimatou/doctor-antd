import React,{ Component,PropTypes } from 'react'
import { Modal,Button,Form,Input } from 'antd'
import { isMobile } from '../../utils'

const FormItem = Form.Item

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
const mobileChecker = (rule,value,callback)=>{
    if( !isMobile(value) ){
        callback(new Error('请输入合法的手机号码'))
    }else{
        callback()
    }
}
class Login extends Component{
    submitHandler=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            this.props.login(values)
        })
    }
    render(){
        const { loading,isAuthed,form } = this.props
        const { getFieldProps } = form
        const accountProps = getFieldProps('mobile',{
            rules:[{
                required:true,
                message:'请输入正确的手机号码',
                validator:mobileChecker
            }]
        })
        const passwordProps = getFieldProps('password',{
            rules:[{
                required:true,
                message:'请输入密码'
            }]
        })
        return(
            <Modal 
                title = '登录'
                visible = { !isAuthed }
                closable = {false}
                footer = {
                    <Button 
                        onClick={this.submitHandler} 
                        type = 'primary'
                        loading = {loading}
                    >
                        登录
                    </Button>
                }
            >
                <Form horizontal form = {form}>
                    <FormItem
                        {...formItemLayout}
                        label = '帐号'
                        hasFeedback
                    >
                        <Input 
                            type="text" autoComplete="off" 
                            {...accountProps}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"     
                        hasFeedback 
                    >
                        <Input 
                            type="password" 
                            autoComplete="off" 
                            {...passwordProps}
                        />
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

Login.propTypes = {
    isAuthed:PropTypes.bool.isRequired,
    form:PropTypes.object.isRequired,
    login:PropTypes.func.isRequired,
    loading:PropTypes.bool.isRequired
}

export default Form.create()(Login)