import React,{Component,PropTypes} from 'react'
import { Form,Input,Upload,Button,Icon, Spin } from 'antd'
import { connect } from 'react-redux'
import {UPLOAD_COVER_API} from '../../constants/api.js'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class Edit extends Component{
    state = {
        fileList:[]
    }
    static propTypes = {
        form:PropTypes.object,
        organize:PropTypes.object,
        handleEdit:PropTypes.func.isRequired,
        loading : PropTypes.bool
    }
    componentWillReceiveProps(nextProps){
        if(!this.props.organize){
            this.setState({
                fileList:[{
                    uid:-1,
                    name:'封面.png',
                    status:'done',
                    url:nextProps.organize.logo
                }]
            })
        }
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
            const params = {
                title:values.title,
                descript:values.descript,
                logo:this.state.fileList[0].url,
                id:this.props.organize.id
            }
            this.props.handleEdit(params)
        })
    }
    render(){
        const { form,organize,loading } = this.props
        const { getFieldDecorator } = form
        return(
            <Spin spinning = { loading } size = 'large' >
            <Form
                horizontal
                form = { form }
                onSubmit = { this.submitHandler }
                style = {{pading:30,margin:'30 0'}}
            >
                <FormItem
                    label='机构名称'
                    {...formItemLayout}
                >
                {getFieldDecorator('title',{
                        rules:[{
                            required:true,
                            max:20,
                            message:'最多20字'
                        }],
                        initialValue:organize&&organize.title
                    })(<Input type='text' />)}
                </FormItem>
                <FormItem
                    label='机构简介'
                    {...formItemLayout}
                >
                {getFieldDecorator('descript',{
                            rules:[{
                                required:false,
                                max:300,
                                message:'最多300字'
                            }],
                            initialValue:organize&&organize.descript
                        })(<Input type='textarea' rows = '5' />)}
                </FormItem>
                <FormItem
                    label='机构封面'
                    {...formItemLayout}
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
                    <FormItem style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </FormItem>
            </Form>
            </Spin>
        )
    }
}

export default connect(
    state=>({
        organize:state.organize.entity,
        loading: state.organize.loading
    }),
    dispatch=>({
        handleEdit:(params)=>{
            dispatch({
                type:'organize/edit',
                payload:params
            })
        }
    })
)(
    Form.create()(Edit)
)
