import React, {Component, PropTypes} from 'react';
import { message, Spin, Modal, Button, Form, Input, Table } from 'antd'
import { add, list, info }from '../../../services/source'
import {VIDEO} from '../../../constants/api'
import Category from '../../Category'
import {isVideo} from '../../../utils/index'
import { get } from '../../../services/html'
import VideoItem from './item'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
class Select extends Component {
    state = {
        loading: true,
        total: 0,
        list: [],
        visible: false,
        category: [],
        latLng: {},
        fetching: false
    }
    componentWillMount() {
        info({state: 1, category_id: VIDEO}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 2,
            offset,
            category_id: VIDEO
        }).then(data => {
            this.setState({
                loading: false,
                list: data.list
            })
        }).catch(error => message.error(error))
    }
    _onCancel = () => this.setState({visible: false})
    _submitHandler = e => {
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            this.setState({fetching: true})
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                this.setState({fetching: false})
                return message.error('请再选择一级分类')
            }
            const params = {
                category_id: VIDEO,
                state: 1,
                path: values.path,
                title: values.title,
                descript: values.descript || ''
            }
            add(params).then(data => {
                message.success('新建成功')
                this.setState({
                    fetching: false, 
                    visible: false, 
                    list: [{ ...params,
                        id: data.identity
                    }].concat(this.state.list),
                    total: this.state.total + 1})
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
                this.setState({fetching: false})
            })
        })
    }
    render() {
        const { total, loading, list, visible, fetching } = this.state
        const { onChange } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            total: total,
            pageSize: 2,
            onChange: offset => this._getList(offset)
        }
        const columns = [{
            title: '视频',
            key: 'path',
            dataIndex: 'path',
            render: (text, record) => (<VideoItem video={record}/>)
        }]
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => onChange(selectedRows[0])
        }
        const form = this.props.form
        const {getFieldDecorator} = form 
        return (
            <div>
                <Spin spinning={fetching}>
                    <Modal visible={visible} title='添加视频' footer='' width={720} onCancel={this._onCancel}>
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
                                <Button type="primary" htmlType="submit">保存</Button>
                            </FormItem>
                        </Form>
                    </Modal>
                </Spin>
                <Button type="primary" onClick={() => this.setState({ visible: true })} style={{ marginBottom: 10 }}>添加</Button>
                <Table dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection}/>
            </div>
        );
    }
}

Select.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default Form.create()(Select)
