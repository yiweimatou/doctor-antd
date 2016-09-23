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
            // this.props.initialCatgory({
            //     area_id: nextProps.yunbook.area_id,
            //     category_id: nextProps.yunbook.category_id
            // },(defaultValue, options) => {
            //     this.setState({
            //         loading: false,
            //         defaultValue,
            //         options
            //     })
            // }, error => message.error(error))
        }
    }
    changeLbl = lbl => this.setState({ lbl })

    submitHandler=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            // const first = values.area_ids[0]
            // let area_id,category_id
            // if(first === 1) {
            //     if( values.area_ids.length < 3) {
            //         return message.error('请再选一级分类')
            //     }
            //     area_id = values.area_ids[values.area_ids.length - 1]
            //     category_id = values.area_ids[1]
            // }else {
            //     if( values.area_ids.length < 4) {
            //         return message.error('请再选一级分类')
            //     }
            //     area_id = values.area_ids[values.area_ids.length -1 ]
            //     category_id = values.area_ids[2]
            // }
            const params = {
                lbl:this.state.lbl,
                // area_id: area_id,
                // category_id: category_id,
                title:values.title,
                descript:values.descript,
                id:this.props.yunbook.id,
                sale_amount: values.money
            }
            this.props.save(params)
        })
    }
    render(){
        const {
            form,yunbook
        } = this.props
        const { getFieldProps }=form
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
                                <Input
                                    type='text'
                                    {...getFieldProps('title',{
                                        rules:[{
                                            required:true,
                                            max:30,
                                            message:'请填写最多30字标题'
                                        }],
                                        initialValue:yunbook&&yunbook.title
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label = '售价'
                                {...formItemLayout}
                            >
                                <Input
                                    type = 'number'
                                    addonAfter = '元'
                                    {...getFieldProps('money',{
                                        rules:[{validator: (rule, value, callback) => {
                                                if(value) {
                                                    callback()
                                                }else {
                                                    callback('请设置金额')
                                                }
                                            }
                                        }],
                                        initialValue:yunbook&&yunbook.sale_amount
                                    })}
                                />
                            </FormItem>
                            <FormItem
                                label='课程简介'
                                {...formItemLayout}
                            >
                                <Input
                                    type='textarea'
                                    rows = '3'
                                    {...getFieldProps('descript',{
                                        rules:[{
                                            required:false,
                                            max:300,
                                            message:'最多300字'
                                        }],
                                        initialValue:yunbook&&yunbook.descript
                                    })}
                                />
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
                                lbl: encodeURIComponent(this.state.lbl),
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
