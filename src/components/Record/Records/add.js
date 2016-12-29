import React, { Component, PropTypes } from 'react'
import { Form, Modal, Spin, Input, Upload, Button, Icon, message } from 'antd'
import records_category from '../../../services/records_category'
import { UPLOAD_FILE_API } from '../../../constants/api'
import record from '../../../services/record'
import records from '../../../services/records'
import records_img from '../../../services/records_img'
import records_item from '../../../services/records_item'

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
            loading: false,
            items: [],
            fileList: [],
            record: {}
        }
        this.changeHandler = this.changeHandler.bind(this)
    }

    componentWillMount() {
        record.get({ id: this.props.record_id }).then((data) => {
            if (data.get.id > 0) {
                records_category.list({
                    state: 1,
                    limit: 1000,
                    offset: 1,
                    id_list: data.get.items,
                    order_by: 'rank',
                    sort: 'desc'
                }).then((data) => {
                    this.setState({ items: data.list })
                }).catch(error => {
                    message.error(`模板选项初始化失败:${error}`)
                })
            }
        })
        records.listAsync({
            limit: 1,
            order_by: 'add_ms',
            sort: 'desc',
            account_id:JSON.parse(localStorage['auth']).key
        }, (error, result) => {
            if (error) {
                message.error(error)
            } else if (result.length > 0) {
                records_item.list({
                    records_id: result[0].id
                }).then((data) => {
                    if (data.list.length > 0) {
                        this.setState(prevState => ({
                            items: prevState.items.map(i => {
                                const item = data.list.find(rd => rd.item_id === i.id)
                                if (item) {
                                    return {
                                        title: i.title,
                                        val: item.val,
                                        item_id: i.id
                                    }
                                }
                                return i
                            })
                        }))
                    }
                })
                this.setState({ record: result[0] })
            }
        })
    }

    okHandler = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            this.setState({ loading: true })
            const { record_id, onOk } = this.props
            records.add({ ...values, record_id }).then((data) => {
                const id = data.identity
                Promise.all(this.state.fileList.map(item => records_img.add({
                        records_id: id,
                        path: item.response.file
                    }).then((data) => ({ id: data.identity, path: item.response.file }))
                )).then((imgResult) => {
                    Promise.all(this.state.items.map((item, idx) =>
                        records_item.add({
                            val: values[idx],
                            item_id: item.id,
                            records_id: id,
                            record_id
                        }).then((data) => ({ id: data.identity, title: item.title, val: values[idx]}))
                        .catch(error => message.error(error))
                    )).then((itemsResult) => {
                        onOk({
                            ...values,
                            imgs: imgResult,
                            items: itemsResult,
                            id,
                            add_ms: (new Date())/1000
                        })
                        message.success('新建成功!')
                        this.setState({ loading: false })
                    })
                }).catch(error => message.error(error))
            }).catch(error => {
                message.error(error)
                this.setState({ loading: false })
            })
        })
    }

    changeHandler(info) {
        const status =  info.file.status
        let fileList = info.fileList
        if (status === 'error') {
            message.error('上传失败，请稍后再试!')
        } else if (status === 'done') {
            fileList = fileList.filter(file => {
                if (file.response.code === 200) {
                    return true
                }
                message.error('服务器未响应，请稍后再试')
                return false
            })
        }
        this.setState({ fileList })
    }
    render() {
        const { onCancel, visible, form } = this.props
        const { record } = this.state
        const { getFieldDecorator } = form
        const props = {
            action: UPLOAD_FILE_API,
            name: 'upload_file',
            listType: 'picture',
            accept: 'image/gif, image/jpeg, image/png',
            fileList: this.state.fileList,
            onChange: this.changeHandler
        }
        const formItems = this.state.items.map((item, idx) => (
            <FormItem key={idx} label={item.title} {...formItemLayout}>
                {getFieldDecorator(idx.toString(), {
                    initialValue: item.val
                })(<Input />)}
            </FormItem>
        ))
        return (
            <Modal
                title="添加"
                maskClosable={false}
                onOk={this.okHandler}
                onCancel={onCancel}
                visible={visible}
                width={720}
            >
                <Spin spinning={this.state.loading}>
                    <Form>
                        <FormItem label="健康描述" {...formItemLayout}>
                            {getFieldDecorator('descript', { initialValue: record.descript })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        {formItems}
                        <FormItem label="饮食/营养" {...formItemLayout}>
                            {getFieldDecorator('diet', { initialValue: record.diet })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="运动" {...formItemLayout}>
                            {getFieldDecorator('sports', { initialValue: record.sports })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="药物" {...formItemLayout}>
                            {getFieldDecorator('drug', { initialValue: record.drug })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="就诊记录" {...formItemLayout}>
                            {getFieldDecorator('visit', { initialValue: record.visit })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="图片" {...formItemLayout}>
                            <Upload {...props}>
                                <Button type="ghost">
                                    <Icon type="upload" />上传
                                </Button>
                            </Upload>
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

Add.propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}

export default Form.create()(Add)
