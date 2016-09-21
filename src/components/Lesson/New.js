import React,{
    Component, PropTypes
} from 'react'
import {
    Form,
    Button,
    Input,
    Upload,
    Icon,
    Spin,
    message,
    Modal
} from 'antd'
import Paper from '../Paper'
import './New.css'
import {UPLOAD_COVER_API} from '../../constants/api.js'
// import AreaCascader from '../AreaCascader'
// import category from '../../constants/category'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class New extends Component {
    static propTypes = {
        form:PropTypes.object,
        newLesson:PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        residue: PropTypes.func.isRequired,
        userId: PropTypes.number
    }
    state = {
        fileList: [],
        loading: true
    }
    componentWillMount() {
        this.props.residue(this.props.userId, num => {
            this.setState({ loading: false })
            if(num === 0){
                Modal.confirm({
                    title: '请确认',
                    content: '最多可创建5门课程',
                    onOk: () => this.props.push('/'),
                    onCancel: () => this.props.push('/')
                })
            }else {
                Modal.warning({
                    title: '请确认',
                    content: `最多可创建5门课程,剩余可创建课程${num}门`
                })
            }
        }, (error) => {
            message.error(error)
        })
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
            if(values.upload[0].response.cover === undefined){
                return
            }
            const params = {
                title:values.lname,
                descript:values.descript||'',
                cover: values.upload[0].response.cover,
                account_amount: values.account_money,
                organize_amount: values.organize_money
            }
            this.setState({ loading: true })
            this.props.newLesson(params, id => {
                this.setState({ loading: false })
                message.success('新增成功!')
                this.props.push(`/lesson/show/${id}`)
            }, error => {
                this.setState({ loading: false })
                message.error(error)
            })
        })
    }
    render(){
        // return (<p style={{textAlign: 'center'}}>暂未开放，敬请期待！</p>)
        const { getFieldProps } = this.props.form
        const lnameProps = getFieldProps('lname',{
            rules:[{
                required:true,
                max:20,
                message:'请输入20字以内课程名'
            }]
        })
        const descriptProps = getFieldProps('descript',{
            rules:[{
                    required:false,max:200,message:'请输入少于200字的简介'
                }]
        })
        return(
            <Paper>
                <Spin spinning={this.state.loading} size="large">
                <Form
                    horizontal
                    className = 'form'
                    onSubmit = { this.submitHandler }
                >
                    <FormItem
                        {...formItemLayout}
                        label='课程名'
                        hasFeedback
                        required
                    >
                        <Input
                            type='text'
                            {...lnameProps}
                        />
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
                            {...getFieldProps('upload',{
                                valuePropName:'fileList',
                                normalize: this.normFile,
                                rules:[{
                                    required:true,
                                    type:'array',
                                    message:'请上传课程封面'
                                }]
                            })}
                        >
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        label = '报名费'
                        {...formItemLayout}
                    >
                        <Input
                            type = 'number'
                            addonAfter = '元'
                            {...getFieldProps('account_money',{
                                rules:[{
                                    validator: (rule, value, callback) => {
                                        if( value >= 0) {
                                            callback()
                                        }else {
                                            callback('金额必须大于等于零')
                                        }
                                    }
                                }],
                                initialValue: 2
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
                            {...getFieldProps('organize_money',{
                                rules:[{
                                    validator: (rule, value, callback) => {
                                        if( value >= 0) {
                                            callback()
                                        }else {
                                            callback('金额必须大于等于零')
                                        }
                                    }
                                }],
                                initialValue: 10
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
                            {...descriptProps}
                        />
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
                </Spin>
            </Paper>
        )
    }
}

export default Form.create()(New)
