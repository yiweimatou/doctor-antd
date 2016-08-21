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
import category from '../../constants/category'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
}
class Recommend extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options:category,
            uid:0
        }
        this.submitHandler = (e) => {
            e.preventDefault()
            this.props.form.validateFields((errors,values) => {
                if(errors || this.state.uid === 0){
                    return
                }
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
                    descript:values.descript?values.descript:'',
                    area_id: area_id,
                    category_id: category_id,
                    rcmd_account_id:this.props.uid,
                    account_id:this.state.uid
                }
                this.props.recommend(params)
            })
        }
        this.loadData=(selectedOptions)=>{
            const targetOption = selectedOptions[selectedOptions.length-1]
            const isLeaf = 5 ===targetOption.zoom
            targetOption.loading=true
            getAreaList({
                limit:100,
                pid:targetOption.value
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
        const aidProps = getFieldProps('area_ids',{
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
                                        if(!value){
                                            cb()
                                        }
                                        else if(isMobile(value)){
                                            getUser({
                                                mobile:value
                                            }).then(data=>{
                                                if(data.get.id>0){
                                                    this.setState({
                                                        uid:data.get.id
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
                        <Button type="primary" htmlType="submit" loading={loading}>推荐</Button>
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