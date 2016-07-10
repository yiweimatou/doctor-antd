import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { Form,Button,Upload,Input,Icon,message,Switch } from 'antd'
import Paper from '../Paper'
import {
    UPLOAD_YUNBOOK_API,
    UPLOAD_PPT_API
} from '../../constants/api.js'
import AreaCascader from '../AreaCascader'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class New extends Component{
    static propTypes ={
        form:PropTypes.object,
        handleNew:PropTypes.func.isRequired
    }
    state={
        fileList:[],
        action:UPLOAD_YUNBOOK_API
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
            console.log(values.upload[0].response)
            const params = {
                title:values.title,
                descript:values.descript,
                aid:values.aid[values.aid.length-1],
                cover:values.upload[0].response.cover,
                path:values.upload[0].response.path,
                width:values.upload[0].response.width,
                height:values.upload[0].response.height,
                zoom:values.upload[0].response.zoom,
                status:values.status?2:1
            }
            this.props.handleNew(params)
        })
    }
    render(){
        const {
            form 
        } = this.props
        const {
            getFieldProps
        } = form
        return(
            <Paper>
                <Form
                    horizontal
                    className = 'form'
                    form = { form }
                    style = {{pading:30,margin:'30 0'}}
                    onSubmit = { this.submitHandler }
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
                                }]
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
                                }]
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label='是否公开'
                        {...formItemLayout}
                    >   
                        <Switch                   
                            {...getFieldProps('status',{
                                valuePropName:'checked',
                                initialValue:true
                            })}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        required
                        label='云板书分类'
                    >
                        <AreaCascader 
                            {...getFieldProps('aid')}
                            level={4}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传云板书'
                        required
                    >
                        <Upload
                            name='upload_file'
                            action={this.state.action}
                            listType="picture"
                            fileList={this.state.fileList}
                            onChange = {this.handleChange}
                            {...getFieldProps('upload',{
                                valuePropName:'fileList',
                                normalize: this.normFile,
                                rules:[{
                                    required:true,
                                    type:'array',
                                    message:'请上传云板书文件'
                                }]
                            })}
                            beforeUpload = {
                                (file)=>{
                                    if(file.type.indexOf('image')>-1){
                                        return
                                    }else if(file.type.indexOf('ppt')>-1){
                                        this.setState({
                                            action:UPLOAD_PPT_API
                                        })
                                    }else{
                                        message.error('请上传图片或者ppt')
                                        return false
                                    }
                                }
                            }
                        >
                            <Button type='ghost'>
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </Paper>
        )
    }
}

export default connect(null,
    dispatch=>({
        handleNew(yunbook){
            dispatch({
                type:'yunbook/new',
                payload:{
                    ...yunbook
                }
            })
        }
    })
)(Form.create()(New))