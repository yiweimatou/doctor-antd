import React, { Component } from 'react'
import { Form, Button, Input, message } from 'antd'
import RefereeSelect from '../referee_select'
import DealerSelect from './select'
import DoctorSelect from '../doctor/select'
import LessonSelect from './lesson_select'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class DealerEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referee_cname: props.dealer.referee_cname,
            doctor_cname: props.dealer.doctor_cname,
            dealer_cname: props.dealer.cname,
            lesson_cname: props.dealer.lesson_cname,
            lessonVisible: false,
            lesson_id: props.dealer.lesson_id,
            referee_account_id: props.dealer.referee_account_id,
            doctor_account_id: props.dealer.doctor_account_id,
            account_id: props.dealer.account_id,
            refereeVisible: false,
            doctorVisible: false,
            dealerVisible: false,
        }
    }
    
    refereeToggle = () => this.setState(prevState => ({
        refereeVisible: !prevState.refereeVisible
    }))

    doctorToggle = () => this.setState(prevState => ({
        doctorVisible: !prevState.doctorVisible
    }))

    dealerToggle = () => this.setState(prevState => ({
        dealerVisible: !prevState.dealerVisible
    }))

    lessonToggle = () => this.setState(prevState => ({
        lessonVisible: !prevState.lessonVisible
    }))

    onLessonSelect = lesson => this.setState({
        lesson_cname: lesson.title,
        lesson_id: lesson.id,
        lessonVisible: false
    })

    onRefereeSelect = refree => {
        this.setState({
            referee_cname: refree.cname,
            referee_account_id: refree.account_id,
            refereeVisible: false
        })
    }

    onDoctorSelect = doctor => {
        this.setState({
            doctor_account_id: doctor.account_id,
            doctor_cname: doctor.cname,
            doctorVisible: false
        })
    }

    onDealerSelect = dealer => {
        this.setState({
            account_id: dealer.account_id,
            dealer_cname: dealer.cname,
            dealerVisible: false
        })
        this.props.form.setFieldsValue({
            cname: dealer.cname
        })
    }

    submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((erros, values) => {
            if (erros) return
            const { 
                referee_account_id,
                lesson_cname,
                lesson_id,
                referee_cname,
                doctor_cname,
                doctor_account_id,
                account_id,
            } = this.state
            const params = {
                referee_account_id,
                lesson_cname,
                lesson_id,
                referee_cname,
                doctor_cname,
                doctor_account_id,
                dealer_cname: values.cname,
                sname: values.sname,
                account_id,
                unit: values.unit ? values.unit : '',
                area: values.area ? values.area : '',
                tel: values.area ? values.tel : '',
                id: this.props.dealer.id
            }
            this.props.edit(params).catch(err => {
                message.error(err)
            })
        })
    }
    render() {
        const { dealer } = this.props
        const {
            referee_cname,
            doctor_cname,
            dealer_cname,
            lesson_cname,
            lessonVisible,
            refereeVisible,
            dealerVisible,
            doctorVisible,
        } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.submitHandler}>
                <FormItem label="医药代表" {...formItemLayout}>
                    <span style={{ marginRight: 10 }}>{referee_cname}</span>
                    <Button onClick={this.refereeToggle}>更换医药代表</Button>
                    <RefereeSelect 
                        visible={refereeVisible}
                        onSelect={this.onRefereeSelect}
                        onCancel={this.refereeToggle}
                        id={dealer.organize_id}
                    />
                </FormItem>
                <FormItem label="经销商" {...formItemLayout}>
                    <span style={{ marginRight: 10 }}>{dealer_cname}</span>
                    <Button onClick={this.dealerToggle}>更换经销商</Button>
                    <DealerSelect 
                        visible={dealerVisible}
                        onSelect={this.onDealerSelect}
                        onCancel={this.dealerToggle}
                        id={dealer.organize_id}
                    />
                </FormItem>
                <FormItem label="关联医生" {...formItemLayout}>
                    <span style={{ marginRight: 10 }}>{doctor_cname}</span>
                    <Button onClick={this.doctorToggle}>更换医生</Button>
                    <DoctorSelect 
                        visible={doctorVisible}
                        onSelect={this.onDoctorSelect}
                        onCancel={this.doctorToggle}
                        id={dealer.organize_id}
                    />
                </FormItem>
                <FormItem label="课程" {...formItemLayout}>
                    <span style={{ marginRight: 10 }}>{lesson_cname}</span>
                    <Button onClick={this.lessonToggle}>更换课程</Button>
                    <LessonSelect
                        visible={lessonVisible}
                        onSelect={this.onLessonSelect}
                        onCancel={this.lessonToggle}
                        id={this.state.doctor_account_id}
                    />
                </FormItem>
                <FormItem label="经销商姓名" {...formItemLayout} required>
                    {getFieldDecorator('cname', {
                        initialValue: dealer.cname,
                        rules: [
                            { required: true, message: '请填写经销商姓名'}
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem label="店名" {...formItemLayout} required>
                    {getFieldDecorator('sname', {
                        initialValue: dealer.sname,
                        rules: [
                            { required: true, message: '请填写店名'}
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem label="单位" {...formItemLayout}>
                    {getFieldDecorator('unit', {
                        initialValue: dealer.unit
                    })(<Input />)}
                </FormItem>
                <FormItem label="电话" {...formItemLayout}>
                    {getFieldDecorator('tel', {
                        initialValue: dealer.tel
                    })(<Input />)}
                </FormItem>
                <FormItem label="地区" {...formItemLayout}>
                    {getFieldDecorator('area', {
                        initialValue: dealer.area
                    })(<Input />)}
                </FormItem>
                <FormItem wrapperCol={{ offset: 6 }} style={{ marginTop: 24 }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(DealerEdit)