import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { Form,Button,Upload,Input,Icon,message, Spin } from 'antd'
import Paper from '../Paper'
import {
    UPLOAD_YUNBOOK_API,
    UPLOAD_PPT_API
} from '../../constants/api.js'
import AreaCascader from '../AreaCascader'
import category from '../../constants/category'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class New extends Component{
    static propTypes ={
        form:PropTypes.object,
        handleNew:PropTypes.func.isRequired,
        loading: PropTypes.bool
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
            const first = values.area_ids[0]
            let area_id,category_id
            if(first === 1) {
                if( values.area_ids.length < 3) {
                    return message.error('请再选一级分类')
                }
                area_id = values.area_ids[values.area_ids.length - 1]
                category_id = values.area_ids[1]
            }else {
                if( values.area_ids.length < 4) {
                    return message.error('请再选一级分类')
                }
                area_id = values.area_ids[values.area_ids.length -1 ]
                category_id = values.area_ids[2]
            }
            const cover = values.upload[0].response.cover
            const params = {
                title:values.title,
                descript:values.descript||'',
                area_id: area_id,
                category_id: category_id,
                cover:cover,
                path:values.upload[0].response.path,
                width:values.upload[0].response.width,
                height:values.upload[0].response.height,
                zoom:values.upload[0].response.zoom,
                money: values.money,
                file_id: 2 //不传报错，随便传一个
            }
            this.props.handleNew(params)
        })
    }
    render(){
        const {
            form, loading 
        } = this.props
        const {
            getFieldProps
        } = form
        return(
            <Paper>
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
                                initialValue:0
                            })}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        required
                        label='云板书分类'
                    >
                       <AreaCascader
                            props = { getFieldProps('area_ids') }
                            level = { 4 }
                            options = { category }
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
                    <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
                </Spin>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        loading: state.yunbook.actionStatus.adding
    }),
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