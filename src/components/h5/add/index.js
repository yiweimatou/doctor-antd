import React, { Component } from 'react'
import { Button, Modal, Form, Input, Spin, message } from 'antd'
import Category from '../../Category'
import ReactQuill from '../../ReactQuill'
import { add } from '../../../services/h5'
import { add as grow } from '../../../services/grow'
import { HTML } from '../../../constants/api'
import ImgUploader from '../../ImgUploader'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            latLng: {},
            category: [],
            loading: false,
            fileList: []
        }
    }
    toggleHandler = () => this.setState((prevState) => ({
        visible: !prevState.visible
    }))
    submitHandler = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { title, descript, sale_amount } = values
            const content = this.refs.editor.quill.root.innerHTML
            if (content === '<p><br></p>') {
                return message.error('请输入内容')
            }
            const { category, latLng, fileList } = this.state
            let cover = ''
            if (fileList && fileList[0]) {
                cover = fileList[0].url
            }
            const params = {
                title, descript, content, sale_amount: sale_amount*100, state: 1, cover
            }
            if (category.length > 0 && category.length < 3) {
                return message.error('请再选择一级分类')
            }
            this.setState({ loading: true })
            add(params).then((data) => {
                this.setState({ loading: false })
                this.toggleHandler()
                this.props.okHandler({
                    id: data.identity,
                    ...params
                })
                // this.props.form.resetFields()
                if (category.length > 0) {
                    grow({
                        title, lat: latLng.lat, lng: latLng.lng, state: 1,
                        category_id: HTML, foreign_id: data.identity, kind: category[0] === '1' ? category[1] : category[2],
                        map_id: 1
                    })
                }
            }).catch(error => {
                this.setState({ loading: false })
                message.error(error)
            })

        })
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { visible, loading } = this.state
        return (
            <div>
                <Modal title="添加图文" onOk={this.submitHandler} onCancel={this.toggleHandler} maskClosable={false} visible={visible} width={720}>
                    <Spin spinning={loading}>
                        <Form>
                            <FormItem {...formItemLayout} label="标题">
                                {getFieldDecorator('title', {
                                    rules: [{
                                        required: true,
                                        message: '请输入标题'
                                    }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="金额">
                                {getFieldDecorator('sale_amount', {
                                    rules: [{
                                        required: true,
                                        message: '请输入金额'
                                    }],
                                    validateTrigger: 'onBlur',
                                    initialValue: 0
                                })(<Input type="number" addonAfter="元"/>)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="分类">
                                <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                            </FormItem>
                            <FormItem {...formItemLayout} label="封面">
                                <ImgUploader fileList={this.state.fileList} onChange={fileList => this.setState({fileList})}/>
                            </FormItem>
                            <FormItem {...formItemLayout} label="描述">
                                {getFieldDecorator('descript')(<Input type="textarea" rows={3} />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="内容">
                                <ReactQuill ref="editor" />
                            </FormItem>
                        </Form>
                    </Spin>
                </Modal>
                <Button type="primary" onClick={this.toggleHandler}>添加图文</Button>
            </div>
        )
    }
}

export default Form.create()(Add)
