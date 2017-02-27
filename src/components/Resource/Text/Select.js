import React, {Component, PropTypes} from 'react';
import { Table, message, Button, Modal, Form, Input, Spin } from 'antd'
import { list, info, add }from '../../../services/source'
import { TEXT } from '../../../constants/api'
import {add as grow} from '../../../services/grow'
import Category from '../../Category'

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
        fetching: false,
        selectedRowKey: []
    }
    componentWillMount() {
        info({state: 1, category_id: TEXT}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 9,
            offset,
            category_id: TEXT
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
            this.setState({ fetching: true })
            const category = this.state.category
            if (category.length > 0 && category.length < 3) {
                this.setState({fetching: false})
                return message.error('请再选择一级分类')
            }
            const params = {
                category_id: TEXT,
                state: 1,
                path: values.path,
                title: values.title,
                descript: values.descript || ''
            }
            add(params).then(data => {
                message.success('新建成功')
                this.setState({fetching: false, visible:false, list: [{
                    ...params,
                    id: data.identity
                }].concat(this.state.list), total: this.state.total + 1})
                if (category.length > 3) {
                    grow({
                        map_id: 1,
                        lat: this.state.latLng.lat,
                        lng: this.state.latLng.lng,
                        state: 1,
                        category_id: TEXT,
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
        const { total, loading, list, fetching, visible, selectedRowKey } = this.state
        const { onChange } = this.props
        const { getFieldDecorator } = this.props.form
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
        }]
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRowKey,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKey: selectedRowKeys })
                onChange(selectedRows[0])
            }
        }
        return (
            <div>
                <Spin spinning={fetching}>
                    <Modal visible={visible} title='添加' footer='' width={720} onCancel={this._onCancel}>
                        <Form onSubmit={this._submitHandler}>
                            <FormItem {...formItemLayout} label='名称' hasFeedback>
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
                <Button onClick={() => this.setState({ visible: true })} style={{ marginBottom: 10 }} type="primary">新增</Button>
                <Table rowKey="id" dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection} onRowClick={
                    (record) => {
                        this.setState({ selectedRowKey: [record.id] })
                        onChange(record)
                    }
                } />
            </div>
        );
    }
}

Select.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default Form.create()(Select)
