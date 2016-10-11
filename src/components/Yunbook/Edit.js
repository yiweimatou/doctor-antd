import React,{ Component,PropTypes } from 'react'
import { connect } from 'react-redux'
import { Tabs,Button,Form,Input, Spin } from 'antd'
import EditLblView from './EditLblView.js'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class Edit extends Component{
    state = {
        lbl:'',
        options:[],
        defaultValue:[],
        loading: false
    }
    static propTypes = {
        yunbook: PropTypes.object,
        save: PropTypes.func,
        loading: PropTypes.bool
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.yunbook){
            this.setState({
                lbl:nextProps.yunbook.lbl
            })
        }
    }
    changeLbl = lbl => this.setState({ lbl })

    submitHandler=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            const params = {
                lbl:this.state.lbl,
                title:values.title,
                descript:values.descript,
                id:this.props.yunbook.id,
                sale_amount: values.money*100
            }
            this.props.save(params)
        })
    }
    render(){
        const {
            form,yunbook
        } = this.props
        const { getFieldDecorator }=form
        return(
            <div>
                <Spin spinning = { this.state.loading } tip="玩命加载中..." >
                <Tabs defaultActiveKey='2'>
                    <TabPane key='1' tab='基本信息修改'>
                        <Form
                            horizontal
                            onSubmit = { this.submitHandler }
                            style = {{pading:30,margin:'30 0'}}
                        >
                             <FormItem
                                {...formItemLayout}
                                label='云板书标题'
                                hasFeedback
                            >
                            {getFieldDecorator('title',{
                                        rules:[{
                                            required:true,
                                            max:30,
                                            message:'请填写最多30字标题'
                                        }],
                                        initialValue:yunbook&&yunbook.title
                            })(<Input type='text' />)}
                            </FormItem>
                            <FormItem
                                label = '售价'
                                {...formItemLayout}
                            >
                            {getFieldDecorator('money',{
                                        rules:[{validator: (rule, value, callback) => {
                                                if(value) {
                                                    callback()
                                                }else {
                                                    callback('请设置金额')
                                                }
                                            }
                                        }],
                                        initialValue:yunbook&&yunbook.sale_amount/100
                            })(<Input type = 'number' addonAfter = '元' />)}
                            </FormItem>
                            <FormItem
                                label='课程简介'
                                {...formItemLayout}
                            >
                            {getFieldDecorator('descript',{
                                        rules:[{
                                            required:false,
                                            max:300,
                                            message:'最多300字'
                                        }],
                                        initialValue:yunbook&&yunbook.descript
                            })(<Input type='textarea' rows = '5' />)}
                            </FormItem>
                            <button type='submit' id='_submit_'></button>
                        </Form>
                    </TabPane>
                    <TabPane key='2' tab='标注修改'>
                        <EditLblView
                            yunbook={yunbook}
                            changeLbl={this.changeLbl}
                        />
                    </TabPane>
                </Tabs>
                <Button style={{top:0,padding: '4px 20px 5px 20px',position:'absolute',right:23}} size='large' type='primary' onClick={()=>{
                        const submit = document.getElementById('_submit_')
                        if(!submit){
                            this.props.save({
                                lbl: this.state.lbl,
                                id: this.props.yunbook.id
                            })
                        }else{
                            submit.click()
                        }
                    }
                }>
                        保存
                </Button>
                </Spin>
            </div>
        )
    }
}

export default connect(
    state => ({
        yunbook: state.yunbook.entity
    }),
    dispatch=>({
        save:(params)=>{
            dispatch({
                type: 'yunbook/edit',
                payload:params
            })
        }
    })
)(Form.create()(Edit))
