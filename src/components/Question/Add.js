import React, { Component } from 'react';
import { Tabs, Form, Input, Button, message, Switch } from 'antd';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}

class Add extends Component {
    state = {
        num: 65 
    }
    // remove = k => {
    //     const { form } = this.props
    //     let keys = form.getFieldValue('keys')
    //     keys = keys.filter(key => key !== k)
    //     form.setFieldsValue({
    //         keys
    //     })
    // }
    add = () => {
        if (this.state.num === 69) {
            return message.error('只能5个选项!')
        }
        const num = this.state.num + 1
        this.setState({ num })
        const { form } = this.props
        let keys = form.getFieldValue('keys')
        keys = keys.concat(String.fromCharCode(num))
        form.setFieldsValue({
            keys,
        })
    }
    submitHandler = () => {

    }
    render() {
        const { getFieldProps, getFieldValue } = this.props.form
        getFieldProps('keys', {
            initialValue: ['A'],
        })
        const formItems = getFieldValue('keys').map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`${k}：`} key={k}>
                    <Input {...getFieldProps(`answer${k}`, {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请填写选项！'
                                }],
                            })} style={{ width: '80%', marginRight: 8 }}
                    />
                    <Switch {...getFieldProps(`key${k}`)} />
                </Form.Item>
            )
        })
        return (
            <Tabs defaultActiveKey = '1'>
                <TabPane tab = '添加试题' key = '1'>
                    <Form horizontal onSubmit = {this.submitHandler}>
                        <FormItem label = '试题' {...formItemLayout} hasFeedback required>
                            <Input type="textarea" rows = {8} />
                        </FormItem>
                        <FormItem label = '分类' {...formItemLayout}>
                        </FormItem>
                        {formItems}
                        <FormItem wrapperCol={{ offset: 6 }}>
                            <Button onClick={this.add} style={{ marginRight: 8 }}>新增选项</Button>
                            <Button type="primary" htmlType="submit">保存</Button>
                        </FormItem>
                    </Form>
                </TabPane>
                <TabPane tab = '批量上传' key = '2'>
                    <p style = {{textAlign: 'center'}}>请根据模板格式填写Excel &nbsp;
                        <a href = "http://7xp3s1.com1.z0.glb.clouddn.com/%E9%A2%98%E5%BA%93%E6%A8%A1%E6%9D%BF.xlsx" target = '_blank'>
                            下载Excel模板
                        </a>
                    </p>
                </TabPane>
            </Tabs>
        );
    }
}

export default Form.create()(Add);