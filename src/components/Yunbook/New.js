import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { Form, Button, Upload, Input, Icon, Spin, message } from 'antd'
import {
    UPLOAD_YUNBOOK_API,
    UPLOAD_PPT_API
} from '../../constants/api.js'
import Category from '../Category'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}

class New extends Component{
    static propTypes ={
        form: PropTypes.object,
        handleNew: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        getList: PropTypes.func.isRequired,
        grow: PropTypes.func.isRequired
    }
    state={
        fileList: [],
        action: UPLOAD_YUNBOOK_API
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
        fileList = fileList.filter(file => {
            if (file.response) {
                return file.response.code === 200
            }
            return true
        })
        this.setState({ fileList })
    }
    submitHandler= e => {
        e.preventDefault()
        // console.log(this.refs.select.getLatLng())
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const category = this.refs.select.refs.category.state.value
            if (category.length < 3) {
                return message.error('请再选择一级分类')
            }
            const cover = values.upload[0].response.cover
            const params = {
                title: values.title,
                descript: values.descript||'',
                cover: cover,
                path: values.upload[0].response.path,
                width: values.upload[0].response.width,
                height: values.upload[0].response.height,
                zoom: values.upload[0].response.zoom,
                sale_amount: values.money*100,
                state: 1
            }
            this.props.handleNew(params)
            this.props.grow({
                
            })
        })
    }
    render(){
        const {
            form, loading, getList
        } = this.props
        const {
            getFieldProps
        } = form
        return(
            <div>
                <Spin spinning = { loading } >
                <Form
                    horizontal
                    className = 'form'
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
                    <FormItem {...formItemLayout} label='分类'>
                        <Category getList={getList} ref='select'/>
                    </FormItem>
                     <FormItem
                        label='云板书简介'
                        {...formItemLayout}
                    >
                        <Input
                            type='textarea'
                            rows = '3'
                            {...getFieldProps('descript',{
                                rules:[{
                                    required:true,
                                    max:300,
                                    message:'描述必填且最多300字'
                                }]
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
                                rules:[{
                                    required: true,
                                    message: '请设置售价'
                                }],
                                initialValue: '2'
                            })}
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
                            {...getFieldProps('upload',{
                                valuePropName:'fileList',
                                normalize: this.normFile,
                                rules:[{
                                    required:true,
                                    type:'array',
                                    message:'请上传云板书文件'
                                }],
                                onChange: (info)=>this.handleChange(info)
                            })}
                            beforeUpload = {
                                (file)=>{
                                    return new Promise((resolve,reject) => {
                                        if( file.type.indexOf('image') > -1 ){
                                            return resolve()
                                        }else if(file.name.toLowerCase().indexOf('ppt') > -1){
                                            this.setState({
                                                action:UPLOAD_PPT_API
                                            })
                                            return resolve()
                                        }else{
                                            return reject(false)
                                        }

                                    })
                                }
                            }
                        >
                            <Button type='ghost'>
                                <Icon type="upload" /> 点击上传文件
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
                </Spin>
            </div>
        )
    }
}

export default connect(
    state => ({
        loading: state.yunbook.actionStatus.adding
    }),
    dispatch=>({
        getList(params, resolve, reject) {
            dispatch({
                type: 'category/list',
                payload: { params, resolve, reject }
            })
        },
        handleNew(yunbook){
            dispatch({
                type:'yunbook/new',
                payload:{
                    ...yunbook
                }
            })
        },
        grow: (params, resolve, reject) => {
            dispatch({
                type: 'grow/add',
                payload: {
                    params, resolve, reject
                }
            })
        }
    })
)(Form.create()(New))
