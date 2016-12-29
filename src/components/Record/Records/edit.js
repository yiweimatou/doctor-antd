import React, { Component, PropTypes } from 'react'
import { Form, Modal, Spin, Input, Upload, Button, Icon, message } from 'antd'
import { UPLOAD_FILE_API } from '../../../constants/api'
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
class Edit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            items: [],
            fileList: [],
            imgIds: []
        }
        this.changeHandler = this.changeHandler.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            records_item.listAsync({
                state: 1, limit: 1000, offset: 1, records_id: nextProps.record.id
            }).then((data) => {
                this.setState({ items: data })
            }).catch(error => {
                message.error(`模板选项初始化失败:${error}`)
            })

            if (nextProps.record.imgs) {
                this.setState({
                    fileList: nextProps.record.imgs.map(img => ({
                        uid: img.id,
                        status: 'done',
                        url: img.path,
                        // name: `${img.id}.png`,
                        response: {
                            code: 200,
                            file: img.path
                        }
                    })),
                    imgIds: nextProps.record.imgs.map(i => i.id)
                })
            }
        }
    }


    okHandler = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            this.setState({ loading: true })
            const { record, onOk } = this.props
            records.edit({ ...values, id: record.id }).then(() => {
                //不在imgIds中的id删除
                const currntIds = this.state.fileList.map(i => i.uid)
                const removeIds = this.state.imgIds.filter(id => currntIds.indexOf(id) === -1)
                removeIds.forEach(id => records_img.remove({ id }))
                Promise.all(this.state.fileList.map(item => {
                    //如果uid不一样则新增
                    if (this.state.imgIds.indexOf(item.uid) === -1) {
                        return records_img.add({
                            records_id: record.id,
                            path: item.response.file
                        }).then((data) => ({ id: data.identity, path: item.response.file }))
                    }
                    return {
                        id: item.uid,
                        path: item.url
                    }
                })).then((imgResult) => {
                    Promise.all(this.state.items.map((item, idx) =>
                        records_item.edit({
                            val: values[idx],
                            id: item.id
                        }).then(() => ({ ...item, val: values[idx]}))
                    )).then((itemsResult) => {
                        onOk({
                            ...values,
                            imgs: imgResult,
                            items: itemsResult,
                            id: record.id
                        })
                        this.setState({ loading: false })
                    })
                })
            }).catch(error => {
                    message.success(error)
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
        const { onCancel, visible, form, record } = this.props
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
        )
    }
}

Edit.propTypes = {
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default Form.create()(Edit)
