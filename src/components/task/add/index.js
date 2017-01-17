import React, { Component } from 'react'
import { Form, Spin, Input, Button, message } from 'antd'
import { add } from '../../../services/task'
import { add as addH5 } from '../../../services/h5'

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
                    addH5({
                        title: values.title,
                        content: values.descript,
                        sale_amount: 200,
                        state: 1
                    })
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
                    <FormItem label="图文标题" {...formItemLayout}>
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true,
                                message: '请输入图文标题'
                            }]
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="图文描述" {...formItemLayout}>
                        {getFieldDecorator('descript', {
                            rules: [{
                                required: true,
                                message: '请输入图文描述'
                            }]
                        })(<Input type="textarea" rows={5} />)}
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }}>
                        <Button type="primary" htmlType="submit">提交任务</Button>
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

export default Form.create()(Add)
