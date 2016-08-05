import React,{Component,PropTypes} from 'react'
import { 
    Form,
    Button,
    Input,
    Upload,
    Icon,
    Cascader,message 
} from 'antd'
import Paper from '../Paper'
import './New.css'
import {UPLOAD_COVER_API} from '../../constants/api.js'
import {getAreaList} from '../../services/area.js'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class New extends Component {
    static propTypes = {
        form:PropTypes.object,
        newLesson:PropTypes.func.isRequired
    }
    state = {
        fileList:[],
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
    normFile(e) {
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }
    loadData=(selectedOptions)=>{
        const targetOption = selectedOptions[selectedOptions.length-1]
        const isLeaf = 5 ===targetOption.zoom
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
    handleChange = (info)=> {
        let fileList = info.fileList
        fileList = fileList.slice(-1)
        fileList = fileList.map((file) => {
        if (file.response) {
            file.url = 'http://121.41.92.56/ywmt/' + file.response.cover
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
            const params = {
                lname:values.lname,
                descript:values.descript,
                aid:values.aid[values.aid.length-1],
                cover:this.state.fileList[0].url
            }
            this.props.newLesson(params)
        })
    }
    render(){
        const {
            form
        } = this.props
        const { getFieldProps } = form
        const lnameProps = getFieldProps('lname',{
            rules:[{
                required:true,
                validator:(rule,value,callback)=>{
                    if(!value||value&&value.length>20){
                        callback(new Error('请输入20字以内课程名'))
                    }else{
                        callback()
                    }
                }
            }]
        })
        const descriptProps = getFieldProps('descript',{
            rules:[{
                    required:false,max:200,message:'请输入少于200字的简介'
                }]
        })
        const aidProps = getFieldProps('aid')
        delete aidProps.value
        return(
            <Paper>
                <Form 
                    horizontal 
                    className = 'form'
                    form = { form }
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
                        >
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    </FormItem>
                    <FormItem
                        label='分类'
                        required
                        {...formItemLayout}
                    >
                        <Cascader
                            placeholder='请选择分类'
                            options = {this.state.options}
                            loadData = {this.loadData}
                            {...aidProps}
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
                    <FormItem wrapperCol={{ span: 16, offset: 4 }} style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </Paper>
        )
    }
}

export default Form.create()(New)