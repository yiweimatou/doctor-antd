import React, {Component, PropTypes} from 'react';
import { Table, message, Button, Icon, Form, Input, Upload, Modal, Spin } from 'antd'
import { list, info, add }from '../../../services/source'
import { AUDIO, UPLOAD_FILE_API } from '../../../constants/api'
import Category from '../../Category'
import {add as grow} from '../../../services/grow'

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
        fetching: false,
        category: [],
        latLng: {}
    }
    componentWillMount() {
        info({state: 1, category_id: AUDIO}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 9,
            offset,
            category_id: AUDIO
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
            const {path} = this.state
            if (!path) {
                return message.error('请上传音频文件!', 5)
            }
            this.setState({fetching: true})
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                this.setState({fetching: false})
                return message.error('请再选择一级分类')
            }
            const params = {
                category_id: AUDIO,
                state: 1,
                path,
                title: values.title,
                descript: values.descript || ''
            }
            add(params).then(data => {
                message.success('新建成功')
                this.setState({
                    fetching: false, visible: false,
                    list: [{
                        ...params,
                        id: data.identity
                    }].concat(this.state.list),
                    total: this.state.total + 1
                })
                if (category.length > 3) {
                    grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: AUDIO,
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
            onChange: offset => this._getList(offset)
        }
        const columns = [{
            title: '',
            key: 'title',
            dataIndex: 'title',
            render: (text, record) => (
                <div>
                    <p>{text}</p>
                    <p>{record.descript}</p>
                </div>
            )
        }, {
            title: '音频',
            key: 'path',
            dataIndex: 'path',
            render: path => (<audio target="_blank" src={path} controls>换个浏览器吧</audio>)
        }]
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => onChange(selectedRows[0])
        }
        const {getFieldDecorator} = this.props.form
        const uploadProps = {
            name: 'upload_file',
            action: UPLOAD_FILE_API,
            accept: 'audio/*',
            beforeUpload: file => {
                const fiveM = 30*1024*1024
                const isToobig = file.size > fiveM
                if (isToobig) {
                    message.error('只允许上传不大于30M的文件!')
                }
                return !isToobig
            },
            onChange: info => {
                if (info.file.status === 'done') {
                    if (info.file.response.code === 200) {
                        this.setState({path: info.file.response.file})
                        message.success(`${info.file.name} 上传成功！`);
                    } else {
                        message.error(`${info.file.name} 上传失败！`)
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败！`);
                }
            },
        }
        return (
            <div>
                <Spin spinning={fetching}>
                    <Modal visible={visible} title="上传音频" footer="" onCancel={this._onCancel} width={720} maskClosable={false}>
                        <Form onSubmit={this._submitHandler}>
                            <FormItem {...formItemLayout} label="音频素材名称" hasFeedback>
                            {getFieldDecorator('title', {rules:[{required: true, whitespace: true, message: '请填写名称'}]})(<Input />)}
                            </FormItem>
                            <FormItem {...formItemLayout} label="音频" required>
                                <Upload {...uploadProps}>
                                    <Button type="ghost">
                                        <Icon type="upload" />上传音频
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem {...formItemLayout} label="分类">
                                <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
                            </FormItem>
                            <FormItem {...formItemLayout} label="说明">
                            {getFieldDecorator('descript')(<Input type='textarea' rows={5} />)}
                            </FormItem>
                            <FormItem wrapperCol={{ offset: 6 }}>
                                <Button type="primary" htmlType="submit">保存</Button>
                            </FormItem>
                        </Form>
                    </Modal>
                </Spin>
                <Button onClick={() => this.setState({ visible: true })} style={{ marginBottom: 10 }} type="primary">新增</Button>
                <Table rowKey="id" dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection}/>
            </div>
        );
    }
}

Select.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default Form.create()(Select);
