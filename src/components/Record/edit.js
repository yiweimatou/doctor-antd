import React, {Component, PropTypes} from 'react'
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
class Edit extends Component {
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
            offset: 1, limit: 1000, order_by: 'rank', sort: 'desc'
        }).then((data) => {
            this.setState({
                options: data.list.map(item => ({
                    label: item.title,
                    value: item.id.toString(),
                    disabled: item.required === 1
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
                id: this.props.item.id,
                items: values.items.join(',')
            }
            this.setState({ loading: true })
            record.edit(params).then(() => {
                message.success('修改成功')
                this.setState({ loading: false })
                this.props.onOk(params)
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        })
    }

    render() {
        const { visible, onCancel, form, item } = this.props
        const { getFieldDecorator } = form
        return (
            <Modal
                title='编辑'
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
                                }],
                                initialValue: item.cname
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
                                ],
                                initialValue: item.mobile
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="性别" {...formItemLayout}>
                            {getFieldDecorator('sex', { initialValue: item.sex })(
                                <RadioGroup>
                                    <Radio value={2}>男</Radio>
                                    <Radio value={3}>女</Radio>
                                    <Radio value={1}>保密</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="生日" {...formItemLayout}>
                            {getFieldDecorator('birthday', {
                                initialValue: moment.unix(item.birthday, 'YYYY-MM-DD')
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem label="主要健康问题" {...formItemLayout}>
                            {getFieldDecorator('descript', { initialValue: item.descript })(<Input type="textarea" rows={5} />)}
                        </FormItem>
                        <FormItem label="选择需要填写健康数据" {...formItemLayout}>
                            {getFieldDecorator('items', {
                                initialValue: item.items ? item.items.split(',') : []
                            })(<CheckboxGroup options={this.state.options} />)}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        )
    }
}

Edit.propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default Form.create()(Edit)
