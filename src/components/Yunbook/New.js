import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { Form,Button,Upload,Input,Icon,message,Switch,Cascader } from 'antd'
import Paper from '../Paper'
import {
    UPLOAD_YUNBOOK_API,
    UPLOAD_PPT_API
} from '../../constants/api.js'
import {getAreaList} from '../../services/area.js'


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
        imgFileList:[],
        pptFileList:[],
        action:UPLOAD_YUNBOOK_API,
        options:[]
    }
    componentWillMount(){
        getAreaList({
                limit:20,
                pid:1,
                zoom:4
            }).then( data=> {
                const options = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.aid,
                        zoom:item.zoom,
                        isLeaf: false
                    }
                })
                this.setState({
                    options
                })
            }).catch( error=>{
                message.error( error )
            })
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = 6 ===targetOption.zoom
        targetOption.loading=true
        getAreaList({
            limit:30,
            pid:targetOption.value,
            zoom:targetOption.zoom+1
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.aid,
                        zoom:item.zoom,
                        isLeaf
                    }
                })
            }else{
                targetOption.children = []
            }
            this.setState({
                options:[...this.state.options]
            })
        }).catch(error=>{
            message.error(error)
        })   
    }
    normFile(e) {
            if (Array.isArray(e)) {
                return e
            }
            return e && e.fileList
    }
    handleChange = (info,image)=> {
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
        if(image){
            this.setState({ imgFileList:fileList })
        }else{
            this.setState({ pptFileList:fileList})
        }
    }
    submitHandler=(e)=>{
        e.preventDefault()
        this.props.form.validateFields((errors,values)=>{
            if(!values.uploadppt&&!values.uploadimg){
                return message.error('请上传云板书')
            }
            if(errors){
                return
            }
            let cover,path,width,height,zoom
            if(values.uploadimg){
                cover = values.uploadimg[0].response.cover
                path = values.uploadimg[0].response.path
                width = values.uploadimg[0].response.width
                height = values.uploadimg[0].response.height
                zoom = values.uploadimg[0].response.zoom
            }else if(values.uploadppt){
                cover = values.uploadppt[0].response.cover
                path = values.uploadppt[0].response.path
                width = values.uploadppt[0].response.width
                height = values.uploadppt[0].response.height
                zoom = values.uploadppt[0].response.zoom
            }else{
                return message.error('请上传云板书')
            }
            const params = {
                title:values.title,
                descript:values.descript,
                aid:values.aid[values.aid.length-1],
                cover:`http://121.41.92.56/ywmt/${cover}`,
                path:`http://121.41.92.56/ywmt/${path}`,
                width:width,
                height:height,
                zoom:zoom,
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
        const aidProps = getFieldProps('aid')
        delete aidProps.value
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
                        label='云板书简介'
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
                       <Cascader
                            placeholder='请选择分类'
                            options = {this.state.options}
                            loadData = {this.loadData}
                            {...aidProps}
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传云板书'
                        required
                    >
                        <Upload
                            name='upload_file'
                            action={UPLOAD_YUNBOOK_API}
                            listType="picture"
                            fileList={this.state.imgFileList}
                            onChange = {(info)=>this.handleChange(info,true)}
                            {...getFieldProps('uploadimg',{
                                valuePropName:'fileList',
                                normalize: this.normFile,
                            })}
                            beforeUpload = {
                                (file)=>{
                                    if(file.type.indexOf('image')>-1){
                                        return
                                    }else{
                                        message.error('请上传图片')
                                        return false
                                    }
                                }
                            }
                        >
                            <Button type='ghost'>
                                <Icon type="upload" /> 点击上传图片
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传云板书'
                        required
                    >
                        <Upload
                            name='upload_file'
                            action={UPLOAD_PPT_API}
                            listType="picture"
                            fileList={this.state.pptLileList}
                            onChange = {(info)=>this.handleChange(info,false)}
                            {...getFieldProps('uploadppt',{
                                valuePropName:'fileList',
                                normalize: this.normFile
                            })}
                            beforeUpload = {
                                (file)=>{
                                    if(file.name.indexOf('ppt')>-1){
                                        return
                                    }else{
                                        message.error('请上传图片')
                                        return false
                                    }
                                }
                            }
                        >
                            <Button type='ghost'>
                                <Icon type="upload" /> 点击上传ppt
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