import React,{Component,PropTypes} from 'react'
import { Form,Input,Upload,Button,Icon } from 'antd'
import { connect } from 'react-redux'
import {UPLOAD_COVER_API} from '../../constants/api.js'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class Edit extends Component{
    state = {
        fileList:[]
    }
    static propTypes = {
        form:PropTypes.object,
        organize:PropTypes.object,
        handleEdit:PropTypes.func.isRequired
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
                oname:values.oname,
                descript:values.descript,
                logo:this.state.fileList[0].url,
                oid:this.props.organize.oid
            }
            this.props.handleEdit(params)
        })
    }
    render(){
        const { form,organize } = this.props
        const { getFieldProps } = form
        return(
            <Form
                horizontal 
                form = { form }
                onSubmit = { this.submitHandler }
                style = {{pading:30,margin:'30 0'}}
            >
                <FormItem
                    label='机构简介'
                    {...formItemLayout}
                >
                    <Input
                        type='textarea'
                        rows = '3'
                        {...getFieldProps('oname',{
                            rules:[{
                                required:true,
                                max:20,
                                message:'最多20字'
                            }],
                            initialValue:organize&&organize.oname
                        })}
                    />
                </FormItem>
                <FormItem
                    label='机构简介'
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
                            }],
                            initialValue:organize&&organize.descript
                        })}
                    />
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
        )
    }
}

export default connect(
    state=>({
        organize:state.organize.entity
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