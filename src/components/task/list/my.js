import React, { Component } from 'react'
import { Tabs, Table, message, Button, Modal, Form, Spin, Input, Steps } from 'antd'
import { info, list, submit } from '../../../services/task'
import Category from '../../Category'
import ReactQuill from  '../../ReactQuill'
import ImgUploader from '../../ImgUploader'
import H5Select from './H5Select'
import { add as grow } from '../../../services/grow'
import { TASK } from '../../../constants/api'
import Help from '../../help'

const TabPane = Tabs.TabPane
const FormItem = Form.Item
const Step = Steps.Step
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class MyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list1: [],
            list2: [],
            total1: 0,
            total2: 0,
            loading1: false,
            loading2: false,
            submitId: 0,
            visible: false,
            loading: false,
            fileList: [],
            currentStep: 0,
            record: {},
            category: [],
            latLng: {}
        }
    }
    
    componentWillMount() {
        this.userId = JSON.parse(localStorage.auth).key
        this.infoHandler({
            send_account_id: this.userId
        })
        this.infoHandler({
            receive_account_id: this.userId
        })
    }
    
    infoHandler = (params) => {
        if (params.send_account_id > 0) {
            this.setState({ loading1: true })
            info(params).then((data) => {
                if (data.count ===0) {      
                    this.setState({
                        total1: 0,
                        list1: [],
                        loading1: false
                    })
                } else {
                    this.changeHandler({ offset: 1, limit: 6, ...params })
                }
            }).catch(error => {
                this.setState({ loading1: false })
                message.error(error)
            })
        } else {
            this.setState({ loading2: true })
            info(params).then((data) => {
                if (data.count ===0) {      
                    this.setState({
                        total2: 0,
                        list2: [],
                        loading2: false
                    })
                } else {
                    this.changeHandler({ offset: 1, limit: 6, ...params })
                }
            }).catch(error => {
                this.setState({ loading2: false })
                message.error(error)
            })
        }
    }

    changeHandler = (params) => {
        if (params.send_account_id > 0) {
            this.setState({ loading1: true })
            list(params).then((data) => {
                this.setState({ list1: data.list, loading1: false })
            }).catch(error => {
                message.error(error)
                this.setState({ loading1: false })
            })
        } else {
            this.setState({ loading2: true })
            list(params).then((data) => {
                this.setState({ list2: data.list, loading2: false })
            }).catch(error => {
                message.error(error)
                this.setState({ loading2: false })
            })
        }
    }
    toggleVisible = () => this.setState(prevState => ({ visible: !prevState.visible }))
    submitHandler = () => {
        this.props.form.validateFields((errors, values) => {
            if (errors) return
            const { title, descript } = values
            const content = this.refs.editor.quill.root.innerHTML
            if (content === '<p><br></p>') {
                return message.error('请输入内容')
            }
            const { category, latLng, fileList, record, submitId } = this.state
            let cover = ''
            if (fileList && fileList[0]) {
                cover = fileList[0].url
            }
            const params = {
                title, descript: descript || '', content, state: 1, cover, id: submitId
            }
            if (record) {
                params.foreign_id = record.id
            }
            if (category.length > 0 && category.length < 3) {
                return message.error('请再选择一级分类')
            }
            this.setState({ loading: true })
            submit(params).then((data) => {
                this.setState(prveState => ({ loading: false, list2: prveState.list2.map(i => {
                    if (i.id ===submitId) {
                        return {
                            ...i,
                            state: 3
                        }
                    }
                    return i
                }) }))
                this.toggleVisible()
                if (category.length > 0) {
                    grow({
                        title, lat: latLng.lat, lng: latLng.lng, state: 1,
                        category_id: TASK, foreign_id: data.identity, kind: category[0] === '1' ? category[1] : category[2],
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
        const { list1, list2, loading1, loading2, total1, total2, loading, visible, currentStep, record } = this.state
        const { getFieldDecorator } = this.props.form
        const columns1 = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 && '待接任务' || text === 2 && '任务中' || text === 3 && '任务完成'
        }]
        const columns2 = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '描述',
            dataIndex: 'descript',
            key: 'descript'
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 && '待接任务' || text === 2 && '任务中' || text === 3 && '任务完成'
        }, {
            title: '操作',
            key: 'opreator',
            render: (text, record) => record.state ===2 && <Button onClick={() => this.setState({ visible: true, submitId: record.id })}>完成任务</Button>
        }]
        const pagination1 = {
            total: total1,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: (offset) => this.changeHandler({ offset, limit:6, send_account_id: this.userId })
        }
        const pagination2 = {
            total: total2,
            showTotal: total => `共${total}条`,
            pageSize: 6,
            onChange: (offset) => this.changeHandler({ offset, limit:6, receive_account_id: this.userId })
        }
        return (
            <div>
                <Help help_id={20} />
            <Tabs defaultActiveKey="1">
                <TabPane tab="我接收的任务" key="1">
                    <Modal title="" visible={visible} onOk={this.submitHandler} onCancel={this.toggleVisible} maskClosable={false} width={720}>
                        <Steps style={{ marginTop: 20 }} key={currentStep}>
                            <Step title="选择H5模板"/>
                            <Step title="修改提交"/>
                        </Steps>
                        {
                            currentStep === 0
                            &&
                            <H5Select clickHandler={
                                record => {
                                    this.setState({ record, currentStep: 1 })
                                    this.props.form.setFieldsValue({
                                        title: record.title,
                                        descript: record.descript
                                    })
                                    if (record.cover) {
                                        this.setState({ 
                                            fileList: [{
                                                uid: -1,
                                                name: '封面',
                                                url: record.cover,
                                                stauts: 'done'
                                            }]
                                        })
                                    }
                                }
                            } />
                        }
                        {
                            currentStep === 1 &&
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
                                        <ReactQuill ref="editor" content={record.content} />
                                    </FormItem>
                                </Form>
                            </Spin>
                        }
                        {
                            currentStep === 0 && <Button type="primary" onClick={() => this.setState({ currentStep: 1 })}>不引用，直接创建</Button>
                        }
                        {
                            currentStep === 1 && <Button type="primary" onClick={() => this.setState({ currentStep: 0 })}>上一步</Button>
                        }
                    </Modal>
                    <Table rowKey="id" dataSource={list2} columns={columns2} loading={loading2} pagination={pagination2} />
                </TabPane>
                <TabPane tab="我发布的任务" key="2">
                    <Table rowKey="id" dataSource={list1} columns={columns1} loading={loading1} pagination={pagination1} />
                </TabPane>
            </Tabs>
            </div>
        )
    }
}

export default Form.create()(MyList)