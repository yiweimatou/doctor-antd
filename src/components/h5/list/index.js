import React, { Component } from 'react'
import { Table, Button, Modal, Form, Input, message, Spin, Popconfirm } from 'antd'
import ReactQuill from '../../ReactQuill'
import { edit, remove } from '../../../services/h5'
import { newSection } from '../../../services/section'
import ImgUploader from '../../ImgUploader'
import LessonSelect from '../../Lesson/select'
import { HTML } from '../../../constants/api'

const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
}
class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            record: {},
            fileList: [],
            fetching: false,
            record2: {},
            visible2: false
        }
        this.toggleVisible = this.toggleVisible.bind(this)
        this.toggleVisible2 = this.toggleVisible2.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.okHandler = this.okHandler.bind(this)
        this.del = this.del.bind(this)
    }
    toggleVisible() {
        this.setState(function(prevState){
            return {
                visible: !prevState.visible
            }
        })
    }
    toggleVisible2() {
        this.setState(function(prevState){
            return {
                visible2: !prevState.visible2
            }
        })
    }
    submitHandler() {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { title, descript, sale_amount } = values
            const content = this.refs.editor.quill.root.innerHTML
            if (content === '<p><br></p>') {
                return message.error('请输入内容')
            }
            let cover = ''
            const fileList = this.state.fileList
            if (fileList && fileList[0]) {
                cover = fileList[0].url
            }
            const params = {
                title, descript: descript || '', content, sale_amount: sale_amount * 100, state: 1, cover, id: this.state.record.id
            }
            this.setState({ fetching: true })
            edit(params).then(() => {
                message.success('编辑成功!')
                this.setState({ fetching: false, visible: false })
                this.props.editHandler(params)
            }).catch(error => {
                this.setState({ fetching: false })
                message.error(error)
            })
        })
    }
    okHandler() {
        newSection({
            organize_id: 0,
            lesson_id: this.state.record2.id,
            category_id: HTML,
            foreign_id: this.state.record.id,
            title: this.state.record.title,
            state: 1,
            descript: this.state.record.descript,
            content: this.state.record.content
        }).then(() => {
            this.setState({ visible2: false })
            message.success('发布成功！')
        }).catch(error => {
            message.error(error)
        })
    }
    del(id) {
        remove({ id }).then(() => {
            message.success('删除成功!')
            this.props.delHandler(id)
        }).catch(error => message.error(error))
    }
    render() {
        const { dataSource, total, loading, onChange, form } = this.props
        const { visible, record, fetching, visible2 } = this.state
        const { getFieldDecorator } = form
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '10%'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript',
            width: '50%'
        }, {
            title: '出售金额',
            dataIndex: 'sale_amount',
            key: 'sale_amount',
            render: text => `${text/100}元`,
            width: '10%'
        }, {
            title: '操作',
            key: 'opreator',
            width: '30%',
            render: (text, record) =>
            <div>
                <Button onClick={() => this.setState({ record, visible2: true })}>发送到课程</Button>
                <span className="ant-divider"></span>
                <Button onClick={() => {
                        this.setState({ 
                            record,
                            fileList: record.cover
                                ? 
                            [{
                                uid: -1, name: '封面.png', status: 'done', url: record.cover
                            }]: []
                        })
                        this.toggleVisible()
                    }
                }>编辑</Button>
                <span className="ant-divider"></span>
                <Popconfirm
                    title="确定要删除这个图文吗？"
                    onConfirm={() => this.del(record.id)}
                >
                    <Button>删除</Button>
                </Popconfirm>
            </div>
        }]
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange
        }
        return (
            <div>
                <Modal width="720" visible={visible2} title="选择课程" onOk={this.okHandler} onCancel={this.toggleVisible2} maskClosable={false}>
                    <LessonSelect onChange={record => this.setState({ record2: record })} />
                </Modal>
                <Modal title="编辑" width={1024} onOk={this.submitHandler} onCancel={this.toggleVisible} maskClosable={false} visible={visible} >
                    <Spin spinning={fetching}>
                        <Form>
                            <FormItem {...formItemLayout} label="标题">
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true,
                                            message: '请输入标题'
                                        }],
                                        initialValue: record.title
                                    })(<Input />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="金额">
                                    {getFieldDecorator('sale_amount', {
                                        rules: [{
                                            required: true,
                                            message: '请输入金额',
                                            type: 'string'
                                        }],
                                        validateTrigger: 'onBlur',
                                        initialValue: record.sale_amount / 100
                                    })(<Input type="number" addonAfter="元"/>)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="封面">
                                    <ImgUploader fileList={this.state.fileList} onChange={fileList => this.setState({fileList})}/>
                                </FormItem>
                                <FormItem {...formItemLayout} label="描述">
                                    {getFieldDecorator('descript',{ initialValue: record.descript })(<Input type="textarea" rows={3} />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="内容">
                                    <ReactQuill ref="editor" content={record.content} />
                                </FormItem>
                        </Form>
                    </Spin>
                </Modal>
                <Table rowKey="id" loading={loading} dataSource={dataSource} columns={columns} pagination={pagination}/>
            </div>
        )
    }
}

export default Form.create()(List)