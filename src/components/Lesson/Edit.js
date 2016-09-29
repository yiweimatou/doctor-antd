import React,{ Component,PropTypes } from 'react'
import {
    Form,
    Button,
    Input,
    Upload,
    Icon,
    message,
    Spin, Switch
} from 'antd'
import Paper from '../Paper'
import {UPLOAD_COVER_API} from '../../constants/api.js'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import LessonBar from './LessonBar'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}

class Edit extends Component{
    static propTypes = {
        handleEdit: PropTypes.func.isRequired,
        lesson: PropTypes.object,
        loading: PropTypes.bool,
        push: PropTypes.func.isRequired,
    }
    state = {
        fileList: [],
        options: [],
        defaultValue: []
    }
    normFile(e) {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    handleChange = (info)=> {
        let fileList = info.fileList
        fileList = fileList.slice(-1)
        fileList = fileList.map((file) => {
            if (file.response) {
                file.url = file.response.cover
            }
            return file
        })
        fileList = fileList.filter((file) => {
            if (file.response) {
                return file.response.code === 200
            }
            return true
        })
        this.setState({ fileList })
    }
    submitHandler= e => {
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(errors){
                return
            }
            const cover = this.state.fileList[0].url
            const params = {
                title:values.lname,
                descript:values.descript,
                cover:cover,
                organize_amount: values.organize_money,
                account_amount: values.account_money*100,
                id:this.props.lesson.id,
                state: values.state ? 1: 2
            }
            this.props.handleEdit(params, () => {
                message.success('编辑成功')
                this.props.push(`/lesson/show/${this.props.lesson.id}`)
            }, error => message.error(error, 6))
        })
    }
    componentWillReceiveProps(nextProps){
        //prelesson is null next is not null
        if(!this.props.lesson && nextProps.lesson){
            this.setState({
                fileList:[{
                    uid:-1,
                    name: '封面.png',
                    status: 'done',
                    url: nextProps.lesson.cover
                }]
            })
        }
    }
    render(){
        const {
            form,lesson,loading
        } = this.props
        const { getFieldDecorator } = form
        return(
            <div>
             <LessonBar lesson={lesson} current='edit' />
            <Paper>
                <Spin spinning = { loading } size = 'large'>
                <Form
                    horizontal
                    className = 'form'
                    onSubmit = { this.submitHandler }
                >
                    <FormItem
                        {...formItemLayout}
                        label='课程名'
                        hasFeedback
                    >
                        <Input
                            type='text'
                            {...getFieldDecorator('lname',{
                                rules:[{
                                    required:true,
                                    max:20,
                                    message:'请输入20字以内课程名'
                                }],
                                initialValue: lesson && lesson.title
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label = '报名费'
                        {...formItemLayout}
                    >
                        <Input
                            type = 'number'
                            addonAfter = '元'
                            {...getFieldDecorator('account_money',{
                                rules:[{
                                    validator: (rule, value, callback) => {
                                        if( value >= 0) {
                                            callback()
                                        }else {
                                            callback('金额必须大于等于零')
                                        }
                                    }
                                }],
                                initialValue: lesson && lesson.account_amount/100
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label = '机构认证费'
                        {...formItemLayout}
                    >
                        <Input
                            type = 'number'
                            addonAfter = '元'
                            {...getFieldDecorator('organize_money',{
                                rules:[{
                                    validator: (rule, value, callback) => {
                                        if(value >= 0) {
                                            callback()
                                        }else {
                                            callback('金额必须大于等于零')
                                        }
                                    }
                                }],
                                initialValue: lesson && lesson.organize_amount
                            })}
                        />
                    </FormItem>
                    <FormItem {...formItemLayout} label="上下架">
<<<<<<< Updated upstream
                        <Switch {...getFieldProps('state', { valuePropName: 'checked', initialValue: lesson && lesson.state === 1})}/>
=======
                        <Switch {...getFieldDecorator('state', { valuePropName: 'checked', initialValue: lesson && lesson.state === 1})}/>
>>>>>>> Stashed changes
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label = 'logo'
                        required
                    >
                        <Upload
                            name="upload_file"
                            action={UPLOAD_COVER_API}
                            listType="picture"
                            fileList={this.state.fileList}
                            onChange = {this.handleChange}
                        >
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        label='课程简介'
                        {...formItemLayout}
                    >
                        <Input
                            type='textarea'
                            rows = '3'
                            {...getFieldDecorator('descript',{
                                rules:[{
                                    required:false,
                                    max:200,
                                    message:'请输入少于200字的简介'
                                }],
                                initialValue:lesson&&lesson.descript
                            })}
                        />
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
                </Spin>
            </Paper>
            </div>
        )
    }
}

export default connect(
    state=>({
        lesson:state.lesson.entity,
        loading : state.lesson.loading
    }),
    dispatch=>({
        handleEdit: (params, resolve, reject) => {
            dispatch({
                type:'lesson/edit',
                payload:{
                    params, resolve, reject
                }
            })
        },
        push: path => dispatch(push(path))
    })
)(Form.create()(Edit))
