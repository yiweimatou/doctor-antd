import React, {Component, PropTypes} from 'react';
import {message, Spin, Modal, Button, Row, Col, Pagination, Form, Input} from 'antd'
import { VIDEO } from '../../../constants/api'
// import BaikeCard from '../Baike/BaikeCard'
import {isVideo} from '../../../utils/index'
import Category from '../../Category'
import { get } from '../../../services/html'
import VideoItem from './item'
import { remove } from '../../../services/source'
import Edit from './edit'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
class Video extends Component {
    state = {
        total: 0,
        list: [],
        loading: true,
        visible: false,
        editVisible: false,
        item: {},
        category: [],
        latLng: {}
    }
    componentWillMount() {
        const {info, list} = this.props
        info({state: 1, category_id: VIDEO})
            .then(data => this.setState({total: data.count}))
            .catch(error => message.error(error))
        list({state: 1, limit: 8, offset: 1, category_id: VIDEO})
            .then(data => this.setState({list: data.list, loading: false}))
            .catch(error => message.error(error))
    }
    editVisibleToggle = () => this.setState(prevState => ({
        editVisible: !prevState.editVisible
    }))
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
                category_id: VIDEO,
                state: 1,
                path: values.path,
                title: values.title,
                descript: values.descript || ''
            }
            this.props.add(params).then(data => {
                message.success('新建成功')
                this.setState({loading: false, visible: false, list: [{
                    ...params,
                    id: data.identity
                }].concat(this.state.list), total: this.state.total + 1})
                if (category.length > 3) {
                    this.props.grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: VIDEO,
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
    del = id => {
        Modal.confirm({
            onOk: () => {
                remove({ id }).then(() => {
                    this.setState({ 
                        list: this.state.list.filter(i => i.id !== id)
                    })
                    message.success('删除成功!')
                }).catch(error => message.error(error))
            },
            title: '确认',
            content: '是否删除？'
        })
        
    }
    render() {
        const {loading, total, list, visible} = this.state  
        const form = this.props.form
        const {getFieldDecorator} = form      
        return (
            <Spin spinning={loading}>
                <Modal visible={visible} title='新增视频' footer='' width={720} onCancel={this._onCancel}>
                    <Form onSubmit={this._submitHandler}>
                        <FormItem {...formItemLayout} label='视频地址' required hasFeedback>
                            {getFieldDecorator('path', {
                                rules: [{
                                    validator(rule, value, callback) {
                                        if (value.length === 0) {
                                            callback('请输入视频地址')
                                        } else if(!isVideo(value)) {
                                            callback('现在支持优酷和腾讯视频！')
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
                        <FormItem {...formItemLayout} label='视频素材名称' hasFeedback>
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
                            <Button type="primary" htmlType="submit">保存至个人素材库</Button>
                        </FormItem>
                    </Form>
                </Modal>
                <Modal title="修改" visible={this.state.editVisible} onCancel={this.editVisibleToggle} maskClosable={false} footer={null}>
                    <Edit item={this.state.item} edit={this.props.edit} afterEdit={
                        video => {
                            this.setState(prevState => ({
                                editVisible: false,
                                list: prevState.list.map(v => {
                                    if (v.id === video.id) {
                                        return {
                                            ...v,
                                            title: video.title,
                                            descript: video.descript
                                        }
                                    }
                                    return v
                                })
                            }))
                        }
                    }/>
                </Modal>
                <div className='image-div-topbar'>
                        <Button type='primary' onClick={() => this.setState({visible: true})}>新增视频</Button>
                        <span className='image-div-topbar-span'>在“腾讯视频”或“优酷”中找到视频，复制视频的网址。</span>
                </div>
                <Row>
                {
                    list.map(item => {
                        return <Col span='6' key={item.id}><VideoItem onClick={
                            () => {
                                this.editVisibleToggle()
                                this.setState({ item })
                            }
                        } video={item} remove={this.del} /></Col>
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

Video.propTypes = {
    add: PropTypes.func.isRequired,
    list: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    grow: PropTypes.func.isRequired
};

export default Form.create()(Video);