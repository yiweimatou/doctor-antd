import React ,{ Component,PropTypes } from 'react'
import {connect} from 'react-redux'
import { Form, Button, Upload, Input, Icon, Spin, message } from 'antd'
import Category from '../Category'
import { BOOK } from '../../constants/api'

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
        latLng: {},
        category: []
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
        if (info.file.status === 'error') {
            return message.error('服务器未响应，请稍后再试', 6)
        }
        if (info.file.status === 'done') {
            return message.success('上传成功!', 6)
        }
    }
    submitHandler= e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                return message.error('请再选择一级分类')
            }
            const file = this.state.fileList[0]
            if (!file) return message.error('请上传图片')
            const params = {
                title: values.title,
                descript: values.descript||'',
                cover: file.url || '',
                path: file.response.path,
                width: file.response.width,
                height: file.response.height,
                zoom: file.response.zoom,
                sale_amount: values.money*100,
                state: 1
            }
            this.props.handleNew(params, yunbook => {
                this.props.addAfterHandler()
                this.props.grow({
                    lat: this.state.latLng.lat,
                    lng: this.state.latLng.lng,
                    title: values.title,
                    state: 1,
                    category_id: BOOK,
                    foreign_id: yunbook.id,
                    cover: file.url,
                    map_id: 1,
                    kind: category[0] === '1' ? category[1] : category[2]
                }, null, error => message.error(error))
            }, error => message.error(error))
        })
    }
    render(){
        const {
            form, loading, action
        } = this.props
        const {
            getFieldDecorator
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
                        
                    {getFieldDecorator('title',{
                        rules:[{
                            required:true,
                            max:30,
                            message:'请填写最多30字标题'
                        }]
                    })(<Input type='text' />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='分类'>
                        <Category onChange={(category, latLng) => this.setState({category, latLng})}/>
                    </FormItem>
                     <FormItem
                        label='云板书简介'
                        {...formItemLayout}
                    >
                    {getFieldDecorator('descript',{
                                rules:[{
                                    required:true,
                                    max:300,
                                    message:'描述必填且最多300字'
                                }]
                    })(<Input type='textarea'rows = '3' />)}
                    </FormItem>
                    <FormItem
                        label = '售价'
                        {...formItemLayout}
                    >
                    {getFieldDecorator('money',{
                                rules:[{
                                    required: true,
                                    message: '请设置售价'
                                }],
                                initialValue: '2'
                    })(<Input type = 'number' addonAfter = '元' />)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label='上传云板书'
                        required
                    >
                        <Upload
                            name='upload_file'
                            action={action}
                            fileList={this.state.fileList}  
                            onChange = {this.handleChange}
                            beforeUpload = { file => {
                                // const fiveM = 5*1024*1024
                                // const isToobig = file.size > fiveM
                                // if (isToobig) {
                                //     message.error('只允许上传不大于5M的图片!')
                                // }
                                //     return !isToobig
                                // }
                                if (file.name.toLowerCase().indexOf('ppt') > -1) {
                                    message.info('ppt上传转换较慢请耐心等待！', 6)
                                }
                            }}
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
        handleNew(yunbook, resolve, reject){
            dispatch({
                type:'yunbook/new',
                payload:{
                    ...yunbook
                },
                resolve, reject
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
