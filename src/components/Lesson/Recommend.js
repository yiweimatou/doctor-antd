import React, {Component, PropTypes} from 'react'
import {
    Form,
    Button,
    Input,
    message,
    Cascader,
    Alert,
    Spin
} from 'antd'
import {getAreaList} from '../../services/area.js'
import {connect} from 'react-redux'
import Paper from '../Paper'
import { isMobile } from '../../utils'
import {getUser} from '../../services/user.js'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class Recommend extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options:[],
            uid:0
        }
        this.submitHandler = (e) => {
            e.preventDefault()
            this.props.form.validateFields((errors,values) => {
                if(errors || this.state.uid === 0){
                    return
                }
                const params = {
                    lname:values.lname,
                    descript:values.descript?values.descript:'',
                    aid:values.aid[2],
                    cover:'http://121.41.92.56/ywmt/cover/2016072014/201607201411356132515f847973726db4253beb52fef52dfe3c7.png',
                    rcmd_uid:this.props.uid,
                    uid:this.state.uid
                }
                this.props.recommend(params)
            })
        }
        this.loadData=(selectedOptions)=>{
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
    render() {
        const {
            form,
            loading
        } = this.props
        const { getFieldProps } = form
        const lnameProps = getFieldProps('lname',{
            rules:[{
                required:true,
                max:20,
                message:'请输入20字以内课程名'
            }]
        })
        const descriptProps = getFieldProps('descript',{
            rules:[{
                    required:false,max:200,message:'请输入少于200字的简介'
                }]
        })
        const aidProps = getFieldProps('aid',{
                                rules:[{
                                    required:true,
                                    type:'array',
                                    message:'请选择分类'
                                }]
                            })
        delete aidProps.value
        const mobileProps = getFieldProps('mobile',{
                                rules:[{
                                    required:true,
                                    whitespace:true,
                                    message:'请输入手机号码'
                                },{
                                    validator:(rule,value,cb) => {
                                        if(isMobile(value)){
                                            getUser({
                                                mobile:value
                                            }).then(data=>{
                                                if(data.get.uid>0){
                                                    this.setState({
                                                        uid:data.get.uid
                                                    })
                                                    cb()
                                                }else{
                                                    cb('该手机号码未注册')
                                                }
                                            })
                                        }else{
                                            cb('请输入合法的手机号码')
                                        }
                                    }
                                }]
                            })
        return (
            <Paper>
                <Spin spinning={loading}>
                <Form
                    style = {{margin:10,padding:10}}
                    horizontal
                    form = { form }
                    onSubmit = { this.submitHandler }
                >
                    <Alert
                        message='推荐说明'
                        description={
                            <ul>
                                <li>1.推荐其他用户创建一门新课程</li>
                                <li>2.推荐成功后，用户获得主讲权限并自动创建推荐的课程</li>
                                <li>3.推荐者成为课程的辅导员</li>
                            </ul>
                        }
                        type='info'
                    />
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
                        label='分类'
                        required
                        {...formItemLayout}
                    >
                        <Cascader
                            placeholder='请选择分类'
                            options={this.state.options}
                            loadData={this.loadData}
                            {...aidProps}
                        />
                    </FormItem>
                     <FormItem
                        label='对方手机号'
                        {...formItemLayout}
                        hasFeedback
                    >
                        <Input
                            type='text'
                            {...mobileProps}
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
                        <Button type="primary" htmlType="submit">推荐</Button>
                    </FormItem>
                </Form>
                </Spin>
            </Paper>
        )
    }
}

Recommend.propTypes = {
    form:PropTypes.object.isRequired,
    recommend:PropTypes.func.isRequired,
    loading:PropTypes.bool.isRequired
}

export default connect(
    state => ({
        loading:state.lesson.loading,
        uid:state.auth.key
    }),
    dispatch => ({
        recommend(params){
            dispatch({
                type:'lesson/recommend',
                payload:params
            })
        }
    })
)(Form.create()(Recommend))