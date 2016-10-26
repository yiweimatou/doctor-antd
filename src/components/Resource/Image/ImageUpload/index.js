import React, {Component, PropTypes} from 'react';
import {UPLOAD_IMG_API, IMAGE} from '../../../../constants/api'
import {message, Form, Input, Button, Spin} from 'antd'
import ImgUploader from '../../../ImgUploader'
import Category from '../../../Category'
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}

class ImageUpload extends Component {
    state = {
        loading: false,
        category: [],
        latLng: {
            lat: 0,
            lng: 0
        }
    }
    _submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            this.setState({loading: true})
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                this.setState({loading: false})
                return message.error('请再选择一级分类')
            }
            let image = ''
            const files = this.refs.uploader.state.fileList
            if (files && files[0]) {
                image = files[0].response.img
            }
            if (!image) {
                this.setState({loading: false})
                return message.error('请上传图片', 5)
            }
            const params = {
                category_id: IMAGE,
                state: 1,
                path: image,
                title: values.title,
                descript: values.descript || ''
            }
            this.props.add(params).then(data => {
                message.success('新建成功')
                this.setState({loading: false})
                this.props.hideModal({
                    ...params,
                    id: data.identity
                })
                if (category.length > 3) {
                    this.props.grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: IMAGE,
                        foreign_id: data.identity,
                        title: values.title,
                        kind: category[0] === '1' ? category[1] : category[2]
                    })
                }
            }).catch(error => {
                message.error(error)
                this.setState({loading: false})
            })
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {loading} = this.state
        return (
            <Spin spinning={loading}>
                <Form onSubmit={this._submitHandler}>
                    <FormItem {...formItemLayout} label='图片名称' hasFeedback>
                        {getFieldDecorator('title',{
                            rules: [{
                                required: true,
                                whitespace: true,
                                message: '请填写图片名称'
                            }]
                        })(<Input />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='分类'>
                        <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                    </FormItem>
                    <FormItem {...formItemLayout} label='图片' required>
                        <ImgUploader action={UPLOAD_IMG_API} ref='uploader'/>
                    </FormItem>
                    <FormItem {...formItemLayout} label='描述'>
                        {getFieldDecorator('descript')(<Input type='textarea' rows={5} />)}
                    </FormItem>
                    <FormItem wrapperCol={{ offset: 6 }}>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </FormItem>
                </Form>
            </Spin>
        );
    }
}

ImageUpload.propTypes = {
    add: PropTypes.func.isRequired,
    hideModal: PropTypes.func.isRequired
};

export default Form.create()(ImageUpload);