import React,{ Component,PropTypes } from 'react'
import { 
    Form,
    Button,
    Input,
    Upload,
    Icon,
    message,
    Cascader,
    Spin 
} from 'antd'
import Paper from '../Paper'
import {UPLOAD_COVER_API} from '../../constants/api.js'
import { connect } from 'react-redux'
import {
    getArea,
    getAreaList
} from '../../services/area.js'
import category from '../../constants/category'
import array from 'lodash/array'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}

class Edit extends Component{
    static propTypes = {
        form:PropTypes.object,
        handleEdit:PropTypes.func.isRequired,
        lesson:PropTypes.object,
        loading: PropTypes.bool
    }
    state = {
        fileList:[],
        options:[]
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
            limit:100,
            pid:targetOption.value,
            zoom:targetOption.zoom+1
        }).then(data=>{
            targetOption.loading=false
            if( data.list.length > 0){
                targetOption.children = data.list.map(item=>{
                    return {
                        label:item.title,
                        value:item.id,
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
            const cover = this.state.fileList[0].url
            const first = values.area_ids[0]
            let area_id,category_id
            if(first === 1) {
                if( values.length < 5) {
                    return
                }
                area_id = values.area_ids[4]
                category_id = values.area_ids[1]
            }else {
                if( values.length < 6) {
                    return
                }
                area_id = values.area_ids[5]
                category_id = values.area_ids[2]
            }
            const params = {
                title:values.lname,
                descript:values.descript,
                area_id: area_id,
                category_id: category_id,
                cover:cover,
                organize_money: values.organize_money,
                account_money: values.account_money,
                id:this.props.lesson.id
            }
            this.props.handleEdit(params)
        })
    }
    componentWillReceiveProps(nextProps){
        //prelesson is null next is not null
        if(!this.props.lesson && nextProps.lesson){
            this.setState({
                fileList:[{
                    uid:-1,
                    name:'封面.png',
                    status:'done',
                    url:nextProps.lesson.cover
                }]
            })
            let a2=[],a3=[],category_ids,default1
            const category_id = nextProps.lesson.category_id
            if(category_id.toString().length===2){
                category_ids = [parseInt(category_id.toString().split('', 2)[0], 10), category_id]
            }else {
                const _temp = category_id.toString().split('', 3)
                category_ids = [parseInt(_temp[0], 10), parseInt(_temp[0]+_temp[1], 10), category_id]
            }
            getArea({
                id:nextProps.lesson.area_id
            }).then(data=>data.get).then(area=>{  
                default1 = [area.pid,area.id]
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:100
                }).then(data=>{
                    data.list.forEach(item=>{
                        a3.push({
                            value:item.id,
                            label:item.title,
                            zoom:item.zoom,
                            isLeaf:true
                        })
                    })
                })
                return area
            }).then(area=>{
                return getArea({
                    id:area.pid
                }).then(data=>data.get)
            }).then(area=>{
                getAreaList({
                    pid:area.pid,
                    zoom:area.zoom,
                    limit:100
                }).then(data=>{
                    data.list.forEach(item=>{
                        if(item.id===area.id){
                            a2.push({
                                value:item.id,
                                label:item.title,
                                zoom:item.zoom,
                                children:a3
                            })
                        }else{
                            a2.push({
                                value:item.id,
                                label:item.title,
                                zoom:item.zoom,
                                isLeaf:false
                            })
                        }
                    })
                })
                const options = category.slice()  
                if(category_ids.length === 2){               
                    const index = array.findIndex(options[0].children, { value: category_id })
                    const _index = array.findIndex(options[0].children[index].children, { value: area.pid })
                    options[0].children[index].children[_index].children = a2
                    this.setState({
                        options: options
                    })
                    this.props.form.setFieldsValue({
                        'area_ids': category_ids.concat([area.pid].concat(default1))
                    })
                }else {          
                    const index = array.findIndex(options[1].children, { value: category_ids[1] })
                    const index1 = array.findIndex(options[1].children[index].children, { value: category_id })
                    const _index = array.findIndex(options[1].children[index].children[index1].children, { value: area.pid })
                    options[1].children[index].children[index1].children[_index].children = a2                      
                    
                    this.setState({
                        options: options
                    })
                    this.props.form.setFieldsValue({
                        'area_ids': category_ids.concat([area.pid].concat(default1))
                    })
                }
            }).catch(error=>{
                message.error(error)
            })
        }
    }
    render(){
        const {
            form,lesson,loading
        } = this.props
        const { options }=this.state
        const { getFieldProps } = form
        const areaIdsProps = getFieldProps('area_ids',{
            rules:[{
                required:true,
                type:'array',
                message:'请选择分类'
            }],
            // initialValue: [2, 22, 224, 4, 76003, 76054]
        })
        return(
            <Paper>
                <Spin spinning = { loading } size = 'large'>
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
                                initialValue:lesson&&lesson.title
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
                                initialValue: lesson&&lesson.account_money
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
                                        if(value >= 0) {
                                            callback()
                                        }else {
                                            callback('金额必须大于等于零')
                                        }
                                    }
                                }],
                                initialValue:lesson&&lesson.organize_money
                            })}
                        />
                    </FormItem>
                    <FormItem
                        label='分类'
                        {...formItemLayout}
                        hasFeedback
                    >
                        <Cascader 
                            placeholder='请选择分类'
                            options={options}  
                            loadData = {this.loadData}
                            {...areaIdsProps}
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
                </Spin>
            </Paper>
        )
    }
}

export default connect(
    state=>({
        lesson:state.lesson.entity,
        loading : state.lesson.loading
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