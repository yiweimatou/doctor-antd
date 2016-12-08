import React, { Component } from 'react'
import { Steps, Button, Form, Pagination, message, Col, Row, Input, Tabs } from 'antd'
import H5Item from '../h5/item'
import { info, list, buy } from '../../services/h5'
import ReactQuill from '../ReactQuill'
import ImgUploader from '../ImgUploader'
import Category from '../Category'

const TabPane = Tabs.TabPane
const Step = Steps.Step
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
}
class AddH5 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            current: 0,
            list: [],
            list1: [],
            list2: [],
            total: 0, //mine
            total1: 0, //sys
            total2: 0, //all
            fileList: [],
            category: [],
            latLng: {},
            content: ''
        }
        this.next = this.next.bind(this)
        this.prev = this.prev.bind(this)
        this.submitHandler = this.submitHandler.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.pickHandler = this.pickHandler.bind(this)
    }
    
    componentWillMount() {
        this.infoHandler(0)
        this.infoHandler(JSON.parse(localStorage['auth']).key)
        this.infoHandler(null)
    }
    
    infoHandler = (accountId) => {
        info({ state: 1, account_id: accountId }).then((data) => {
            if (data.count > 0) {
                this.changeHandler(1, accountId)
                if (accountId === 0) {
                    this.setState({ total1: data.count })
                } else if (accountId === null) {
                    this.setState({ total2: data.count })
                } else {
                    this.setState({ total: data.count })
                }
            } else {
                if (accountId === 0) {
                    this.setState({ total1: 0, list1: [] })
                } else if (accountId === null) {
                    this.setState({ total2: 0, list2: [] })
                } else {
                    this.setState({ total: 0, list: [] })
                }
            }
        }).catch(error => message.error(error))
    }

    changeHandler = (offset, accountId) => {
        list({
            limit: 6, offset, state: 1, account_id: accountId
        }).then(data => {
            this.setState({ loading: false })
            if (accountId === 0) {
                this.setState({ list1: data.list })
            } else if (accountId === null) {
                this.setState({ list2: data.list })
            } else {
                this.setState({ list: data.list })
            }
        }).catch(error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }

    next() {
        this.setState(function (prevState) {
            return {
                current: prevState.current + 1
            }
        })
    }
    prev() {
        this.setState(function (prevState) {
            return {
                current: prevState.current - 1
            }
        })
    }
    submitHandler() {

    }
    pickHandler(record) {
        buy({ id: record.id, lesson_id: this.props.location.query.lid, organize_id: this.props.location.query.oid }).then(() => {
            message.info(`购买成功, 花费${record.sale_amount/100}元`)
            this.props.form.setFieldsValue({
                title: record.title,
                descript: record.descript
            })
            this.setState({
                content: record.content,
                fileList: record.cover
                            ? 
                        [{
                            uid: -1, name: '封面.png', status: 'done', url: record.cover
                        }]:[],
            })
            this.next()
        }).catch(error => message.error(error))
        
    }
    render() {
        const { current, list, content, list1, list2, total, total1, total2 } = this.state
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Steps current={current}>
                    <Step key={1} title="选择图文" />                    
                    <Step key={2} title="确认保存" />
                </Steps>
                {
                    current === 0 
                    &&
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="系统图文" key="1">
                            <Row>
                            {
                                list1.map(item => (
                                    <Col span={8} key={item.id} ><H5Item pickHandler={this.pickHandler} item={item} /></Col>))
                            }
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Pagination total={total1} onChange={offset => this.changeHandler(offset, 0)} showTotal={total => `共${total}条`}/>
                            </Row>
                        </TabPane>
                        <TabPane tab="我的图文" key="2">
                            <Row>
                            {
                                list.map(item => (
                                    <Col span={8} key={item.id} ><H5Item pickHandler={this.pickHandler} item={item} /></Col>))
                            }
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Pagination total={total} onChange={offset => this.changeHandler(offset, JSON.parse(localStorage.auth).key)} showTotal={total => `共${total}条`}/>
                            </Row>
                        </TabPane>
                        <TabPane tab="全部图文" key="3">
                            <Row>
                            {
                                list2.map(item => (
                                    <Col span={8} key={item.id} ><H5Item pickHandler={this.pickHandler} item={item} /></Col>))
                            }
                            </Row>
                            <Row style={{ marginTop: 20 }}>
                                <Pagination total={total2} onChange={offset => this.changeHandler(offset, null)} showTotal={total => `共${total}条`}/>
                            </Row>
                        </TabPane>
                    </Tabs>
                }
                {
                    current === 1
                    &&
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
                                    <ReactQuill ref="editor" content={content} />
                                </FormItem>
                        </Form>
                }
                <Row style={{ marginTop: 20 }}>
                    {
                         current < 1
                         && 
                         <Button type="primary" onClick={this.next}>下一步</Button>
                    }
                    {
                        current > 0
                        &&
                        <Button type="primary" onClick={this.prev}>上一步</Button>
                    }
                    {
                        current === 1
                        &&
                        <Button style={{ marginLeft: 10 }} type="primary" onClick={this.submitHandler}>提交</Button>
                    }
                </Row>
            </div>
        )
    }
}

export default Form.create()(AddH5)