import React,{ Component,PropTypes } from 'react'
import { 
    Form,
    Button,
    Input,
    Upload,
    Icon,
    message,
    Cascader 
} from 'antd'
import Paper from '../Paper'
import {UPLOAD_COVER_API} from '../../constants/api.js'
import { connect } from 'react-redux'
import {
    getArea,
    getAreaList
} from '../../services/area.js'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class Edit extends Component{
    static propTypes = {
        form:PropTypes.object,
        handleEdit:PropTypes.func.isRequired,
        lesson:PropTypes.object
    }
    state = {
        fileList:[],
        options:[],
        defaultValue:[]
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
                cover:this.state.fileList[0].url,
                lid:this.props.lesson.lid
            }
            this.props.handleEdit(params)
        })
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.lesson){
            this.setState({
                fileList:[{
                    uid:-1,
                    name:'封面.png',
                    status:'done',
                    url:nextProps.lesson.cover
                }]
            })
            let a1=[],a2=[],a3=[]
            getArea({
                aid:nextProps.lesson.aid
            }).then(data=>data.get).then(area=>{
                this.setState({
                    defaultValue:[area.pid,area.aid]
                })
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        a3.push({
                            value:item.aid,
                            label:item.title,
                            zoom:item.zoom,
                            isLeaf:true
                        })
                    })
                })
                return area
            }).then(area=>{
                return getArea({
                    aid:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:30
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.aid===area.aid){
                            a2.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                children:a3
                            })
                        }else{
                            a2.push({
                                value:item.aid,
                                label:item.title,
                                zoom:item.zoom,
                                isLeaf:false
                            })
                        }
                    })
                })
                this.setState({
                    defaultValue:[area.pid].concat(this.state.defaultValue)
                })
                return area
            }).then(area=>{
                getArea({
                    aid:area.pid
                }).then(data=>{
                    getAreaList({
                        pid:data.get.pid,
                        zoom:data.get.zoom,
                        limit:30
                    }).then(data=>{
                        data.list.forEach(item=>{
                            if(item.aid===area.pid){
                                a1.push({
                                    value:item.aid,
                                    label:item.title,
                                    zoom:item.zoom,
                                    children:a2
                                })
                            }else{
                                a1.push({
                                    value:item.aid,
                                    label:item.title,
                                    zoom:item.zoom,
                                    isLeaf:false
                                })
                            }
                        })
                        this.setState({
                            options:a1
                        })
                    })
                })
            }).catch(error=>{
                message.error(error)
            })
        }
    }
    render(){
        const {
            form,lesson
        } = this.props
        const {defaultValue,options}=this.state
        const { getFieldProps } = form
        const aidProps = getFieldProps('aid',{
            rules:[{
                required:true,
                type:'array',
                message:'请选择分类'
            }],
            initialValue:defaultValue
        })
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
                    >
                        <Input
                            type='text'
                            {...getFieldProps('lname',{
                                rules:[{
                                    required:true,
                                    max:20,
                                    message:'请输入20字以内课程名'
                                }],
                                initialValue:lesson&&lesson.lname
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label='分类'
                        {...formItemLayout}
                        hasFeedback
                    >{defaultValue.length===3?
                        <Cascader 
                            placeholder='请选择分类'
                            options={options}  
                            loadData = {this.loadData}
                            defaultValue = {defaultValue} 
                            {...aidProps}
                        />:null}
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
                            {...getFieldProps('descript',{
                                rules:[{
                                    required:false,
                                    max:200,
                                    message:'请输入少于200字的简介'
                                }],
                                initialValue:lesson&&lesson.descript
                            })}
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

export default connect(
    state=>({
        lesson:state.lesson.entity
    }),
    dispatch=>({
        handleEdit:(params)=>{
            dispatch({
                type:'lesson/edit',
                payload:params
            })
        }
    })
)(Form.create()(Edit))