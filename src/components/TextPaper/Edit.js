import React, {Component, PropTypes} from 'react';
import { Form, Spin, Input, InputNumber, Button, Table, message } from 'antd'
import Select from '../Question/Select'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

class Edit extends Component {
    state = {
        topicList: [],
        visible: false,
        pagination: {
            showSizeChanger: true,
            total: this.props.total,
            showTotal: total => `共 ${total} 条`
        }
    }
    addQuestion = () => {
        this.setState({ visible: true })
    }
    remove = id => {
        this.setState({ topicList: this.state.topicList.filter(i => i.id !== id) })
    }
    okHandler = list => {
        this.setState({ topicList: list, visible: false, pagination: {
        ...this.state.pagination,
        totol: list.length
        } })
    }
    cancelHandler = () => {
        this.setState({ visible: false })
    }
    submitHandler = e => {
        e.preventDefault()
        const { form, edit, push, topics } = this.props
        form.validateFields((errors, values) => {
            if (errors) return
            let topic_id_list = ''
            if (this.state.topicList.length === 1) {
                topic_id_list = this.state.topicList[0].id
            } else if(this.state.topicList.length === 0) {
                return message.error('请选择试题', 6)
            } else {
                this.setState({ loading: true })
                topic_id_list = this.state.topicList.reduce((previousValue, currentValue, index) => {
                    if (index === 0) {
                        return previousValue.id
                    }
                    if (index === 1) {
                        return `${previousValue.id},${currentValue.id}`
                    } else {
                        return `${previousValue},${currentValue.id}`
                    }
                })
            }
            edit({
                title: values.title,
                sale_amount: values.sale_amount*100,
                topic_id_list,
                id: topics.id
            }, () => {
                message.success('编辑成功')
                push('/textpaper/manage')
            }, error => message.error(error))
        })
    }
    componentWillReceiveProps(nextPorps) {
        if (nextPorps.topics.id > 0 && nextPorps.topics.topic_list) {
            this.setState({ topicList: nextPorps.topics.topic_list })
        }
    }
    render() {
        const {
            getFieldDecorator
        } = this.props.form
        const { loading, topics } = this.props
        const sale_amount = topics.sale_amount && topics.sale_amount/100
        const columns = [{
            title: '试题',
            dataIndex: 'question',
            key: 'question',
            width: '80%'
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => < Button onClick = {
                () => this.remove(record.id)
            } > 删除 < /Button>
        }]
        return (
            <Spin spinning={loading}>
                <Select selectedIdList={this.state.topicList.map(i=>({id: i.id,question: i.question}))} visible={this.state.visible} okHandler={this.okHandler} cancelHandler={this.cancelHandler}/>
                <Form onSubmit = {this.submitHandler}>
                <FormItem {...formItemLayout} hasFeedback label="试卷标题">
                        {getFieldDecorator('title', {
                            rules: [{
                            required: true,
                            whitespace: true,
                            message: '请填写标题'
                            }],
                            initialValue: topics.title
                        })(<Input type="text" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="金额">
                    {getFieldDecorator('sale_amount', {
                        initialValue: sale_amount
                    })(<InputNumber min={0} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="试题列表">
                    <Table rowKey="id" pagination={this.state.pagination} dataSource={this.state.topicList} columns={columns} bordered title={
                        () => <Button onClick={this.addQuestion}>添加试题</Button>
                    }>
                    </Table>
                </FormItem>
                <FormItem wrapperCol={{ offset: 6 }}>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
                </Form>
            </Spin>
        );
    }
}

Edit.propTypes = {
    topics: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    edit: PropTypes.func.isRequired
};

export default connect(
    state => ({
        topics: state.topics.entity,
        loading: state.topics.loading
    }),
    dispatch => ({
        edit: (params, resolve, reject) => {
            dispatch({
                type: 'topics/edit',
                payload: {
                    params, resolve, reject
                }
            })
        },
        push: path => dispatch(push(path))
    })
)(Form.create()(Edit));