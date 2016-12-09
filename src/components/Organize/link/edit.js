import React, { Component } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { isMobile } from '../../../utils'
import { edit } from '../../../services/link'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }
    okHandler = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            this.setState({ loading: true })
            const params = {
                ...this.props.record,
                cname: values.cname,
                dept: values.dept,
                rank: values.rank,
                mobile: values.mobile
            }
            edit(params).then(() => {
                message.success('编辑成功!')
                this.setState({ loading: false })
                this.props.onOk(params)
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        })
    }
    render() {
        const { visible, onCancel, record, form } = this.props
        const { getFieldDecorator } = form
        return (
            <Modal visible={visible} onOk={this.okHandler} onCancel={onCancel} maskClosable={false} title="编辑" width={720}>
                <Form>
                    <FormItem label="姓名" {...formItemLayout}>
                        {getFieldDecorator('cname', {
                            rules: [{
                                required: true, message: '请填写姓名'
                            }],
                            initialValue: record.cname
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="手机号码" {...formItemLayout}>
                        {getFieldDecorator('mobile', {
                            rules: [{
                                validator: (rule, value, callback) => {
                                    if (value) {
                                        if (isMobile(value)) {
                                            callback()
                                        } else {
                                            callback('请填写正确的手机号码!')
                                        }
                                    } else {
                                        callback('请填写手机号码')
                                    }
                                }
                            }],
                            initialValue: record.mobile
                        })(<Input readOnly={record.state === 1}/>)}
                    </FormItem>
                    <FormItem label="科室" {...formItemLayout}>
                        {getFieldDecorator('dept', {
                            initialValue: record.dept
                        })(<Input />)}
                    </FormItem>
                    <FormItem label="职称" {...formItemLayout}>
                        {getFieldDecorator('rank', {
                            initialValue: record.rank
                        })(<Input />)}
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(Edit)