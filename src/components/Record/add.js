import React, { Component, PropTypes } from 'react'
import { Form, Modal, Spin, Input, message, Radio, DatePicker, Checkbox } from 'antd'
import moment from 'moment'
import { isMobile } from '../../utils'
import record from '../../services/record'
import record_category from '../../services/records_category'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const RadioGroup = Radio.Group
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
            loading: false,
            options: []
        }
        this.okHandler = this.okHandler.bind(this)
    }
    
    componentWillMount() {
        record_category.list({
            offset: 1, limit: 1000
        }).then((data) => {
            this.setState({
                options: data.list.map(item => ({
                    label: item.title,
                    value: item.id
                }))
            })
        })
    }
    
    okHandler() {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const params = {
                ...values,
                birthday: values.birthday && values.birthday.format('YYYY-MM-DD') || null,
                descript: values.descript || '',
                items: values.items.join(',')
            }
            this.setState({ loading: true })
            record.add(params).then((data) => {
                message.success('添加成功')
                this.setState({ loading: false })
                this.props.onOk({
                    ...params,
                    id: data.identity
                })
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        })
    }
    render() {
        const { visible, onCancel, form } = this.props
        const { getFieldDecorator } = form
        return (
            <Modal 
                title='添加'
                visible={visible}
                onOk={this.okHandler}
                onCancel={onCancel}
                maskClosable={false}
                width={720}>
                <Spin spinning={this.state.loading}>
                    <Form>
                        <FormItem label="姓名" {...formItemLayout}>
                            {getFieldDecorator('cname', {
                                rules: [{
                                    required: true,
                                    message: '请填写姓名'
                                }]
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="手机号" {...formItemLayout}>
                            {getFieldDecorator('mobile', {
                                validateTrigger: 'onBlur',
                                rules: [
                                    { validator: (rule, value, callback) => {
                                        if (value) {
                                            if (isMobile(value)) {
                                                callback()
                                            } else {
                                                callback('请填写正确的手机号码')
                                            }
                                        } else {
                                            callback('请填写手机号码')
                                        }
                                    }}
                                ]
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="性别" {...formItemLayout}>
                            {getFieldDecorator('sex', { initialValue: 1 })(
                                <RadioGroup>
                                    <Radio value={2}>男</Radio>
                                    <Radio value={3}>女</Radio>
                                    <Radio value={1}>保密</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="生日" {...formItemLayout}>
                            {getFieldDecorator('birthday', {
                                initialValue: moment('1990-01-01', 'YYYY-MM-DD')
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem label="主要健康问题" {...formItemLayout}>
                            {getFieldDecorator('descript')(<Input type="textarea" rows={5} />)}
                        </FormItem>
                        <FormItem label="选择需要填写健康数据" {...formItemLayout}>
                            {getFieldDecorator('items')(<CheckboxGroup options={this.state.options} />)}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

Add.propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired, 
    onCancel: PropTypes.func.isRequired,
}

export default Form.create()(Add)