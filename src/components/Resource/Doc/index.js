import React, {Component, PropTypes} from 'react';
import {message, Spin, Modal, Button, Row, Col, Pagination, Form, Input} from 'antd'
import { DOC } from '../../../constants/api'
import BaikeCard from '../Baike/BaikeCard'
import {isUrl} from '../../../utils/index'
import Category from '../../Category'
import { get } from '../../../services/html'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
class Doc extends Component {
    state = {
        total: 0,
        list: [],
        loading: true,
        visible: false,
        category: [],
        latLng: {}
    }
    componentWillMount() {
        const {info, list} = this.props
        info({state: 1, category_id: DOC})
            .then(data => this.setState({total: data.count}))
            .catch(error => message.error(error))
        list({state: 1, limit: 8, offset: 1, category_id: DOC})
            .then(data => this.setState({list: data.list, loading: false}))
            .catch(error => message.error(error))
    }
    _onCancel = () => this.setState({visible: false})
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
            const params = {
                category_id: DOC,
                state: 1,
                path: values.path,
                title: values.title,
                descript: values.descript || ''
            }
            this.props.add(params).then(data => {
                message.success('新建成功')
                this.setState({loading: false, visible: false, list: this.state.list.concat({
                    ...params,
                    id: data.identity
                }), total: this.state.total + 1})
                if (category.length > 3) {
                    this.props.grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: DOC,
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
        const {loading, total, list, visible} = this.state  
        const form = this.props.form
        const {getFieldDecorator} = form      
        return (
            <Spin spinning={loading}>
                <Modal visible={visible} title='添加文献' footer='' width={720} onCancel={this._onCancel}>
                    <Form onSubmit={this._submitHandler}>
                        <FormItem {...formItemLayout} label='文献地址' required hasFeedback>
                            {getFieldDecorator('path', {
                                rules: [{
                                    validator(rule, value, callback) {
                                        if (value.length === 0) {
                                            callback('请输入文献地址')
                                        } else if(!isUrl(value)) {
                                            callback('请输入正确的地址')
                                        } else {
                                            get(value).then((data) => {
                                                form.setFieldsValue({
                                                    title: data.title,
                                                    descript: data.description
                                                })
                                            })
                                            callback()
                                        }
                                    }
                                }],
                                validateTrigger: 'onBlur'
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label='文献素材名称' hasFeedback>
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请填写名称'
                                }]
                            })(<Input />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label='分类'>
                            <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                        </FormItem>
                        <FormItem {...formItemLayout} label='说明'>
                            {getFieldDecorator('descript')(<Input type='textarea' rows={5}/>)}
                        </FormItem>
                        <FormItem wrapperCol={{ offset: 6 }}>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <div className='image-div-topbar'>
                        <Button type='primary' onClick={() => this.setState({visible: true})}>添加文献</Button>
                        <span className='image-div-topbar-span'>添加互联网上文献资料</span>
                </div>
                <Row>
                {
                    list.map(item => {
                        return <Col span='6' key={item.id}><BaikeCard record={item}/></Col>
                    })
                }
                </Row>
                {
                    total === 0 ? <p style={{marginTop: 20, textAlign: 'center'}}>暂无数据</p> :
                <div style={{marginTop: 20}}>
                    <Pagination total={total} pageSize={8} showTotal={total => `共${total}条`}/>
                </div>
                }
            </Spin>
        );
    }
}

Doc.propTypes = {
    add: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    grow: PropTypes.func.isRequired
};

export default Form.create()(Doc);