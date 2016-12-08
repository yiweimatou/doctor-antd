import React, { Component } from 'react'
import { Form, Spin, Input, Button, message } from 'antd'
import { add } from '../../../services/task'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
        this.submitHandler = this.submitHandler.bind(this)
    }
    submitHandler(e) {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const id = this.props.params.id
            if (id > 0) {
                this.setState({ loading: true })
                add({
                    title: values.title,
                    descript: values.descript,
                    lesson_id: id
                }).then(() => {
                    message.success('提交成功!')
                    this.setState({ loading: false })
                    this.props.form.resetFields()
                }).catch(error => {
                    message.error(error)
                    this.setState({ loading: false })
                })
            } else {
                message.error('非法URL')
            }
        })
    }
    render() {
        const { loading } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <Spin spinning={loading}>
                <Form onSubmit={this.submitHandler}>
                    <FormItem label="任务标题" {...formItemLayout}>
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: '请输入任务标题'
                            }]
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="任务描述" {...formItemLayout}>
                        {getFieldDecorator('descript', {
                            rules: [{
                                required: true,
                                message: '请输入任务描述'
                            }]
                        })(<Input type="textarea" rows={5} />)}
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }}>
                        <Button type="primary" htmlType="submit">确认提交</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

export default Form.create()(Add)