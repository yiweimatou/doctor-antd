import React, { Component, PropTypes } from 'react'
import { Form, Modal, Spin, Input, Upload, Button, Icon, message } from 'antd'
import records_category from '../../../services/records_category'
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
class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            items: [],
            fileList: []
        }
        this.changeHandler = this.changeHandler.bind(this)
    }
    
    componentWillMount() {
        records_category.list({
            state: 1, limit: 1000, offset: 1
        }).then((data) => {
            this.setState({ items: data.list })
        }).catch(error => {
            message.error(`模板选项初始化失败:${error}`)
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
                            title: item.title,
                            records_id: id,
                            record_id
                        }).then((data) => ({ id: data.identity, title: item.title, val: values[idx]}))
                        .catch(error => message.error(error))
                    )).then((itemsResult) => {
                        onOk({
                            ...values,
                            imgs: imgResult,
                            items: itemsResult,
                            id
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
                    rules: [{
                        required: item.required === 1,
                        message: `必须填写${item.title}`
                    }],
                    initialValue: 0
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
                        <FormItem label="就诊记录" {...formItemLayout}>
                            {getFieldDecorator('visit', { initialValue: '' })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        {formItems}                        
                        <FormItem label="健康描述" {...formItemLayout}>
                            {getFieldDecorator('descript', { initialValue: '' })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="饮食" {...formItemLayout}>
                            {getFieldDecorator('diet', { initialValue: '' })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="运动" {...formItemLayout}>
                            {getFieldDecorator('sports', { initialValue: '' })(
                                <Input type="textarea" rows={3} />
                            )}
                        </FormItem>
                        <FormItem label="药物" {...formItemLayout}>
                            {getFieldDecorator('drug', { initialValue: '' })(
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