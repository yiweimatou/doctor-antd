import React, { Component } from 'react';
import { Form, Input, Button, message, Switch, Upload, Icon, Spin, } from 'antd';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
import { UPLOAD_COVER_API } from '../../constants/api'

class Add extends Component {
    state = {
      num: 65,
      loading: false,
      fileList: []
    }
    //remove latest optoin
    remove = () => {
        if (this.state.num === 65) return
        const { form } = this.props
        let keys = form.getFieldValue('keys')
        keys = keys.filter(key => key !== String.fromCharCode(this.state.num))
        this.setState({ num: this.state.num - 1 })
        form.setFieldsValue({
            keys
        })
    }
    add = () => {
        if (this.state.num === 69) {
            return message.error('最多只能5个选项!')
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
    submitHandler = e => {
      e.preventDefault()
      this.props.form.validateFields((errors, values) => {
        if(errors) return
        let answer = ''
        values.keys.forEach(val => {
          if(values[`key${val}`]) {
            answer += val
          }
        })
        const params = {
          state: 1,//默认发布
          question_imgurl: this.state.fileList[0] || '',
          question: values.question,
          answer: answer,
          option1: values.A || '',
          option2: values.B || '',
          option3: values.C || '',
          option4: values.D || '',
          option5: values.E || ''
        }
        this.setState({ loading: true })
        this.props.add(params, () => {
          message.success('新增成功', 5)
          this.setState({ loading: false })
          this.props.form.resetFields()
          this.props.afterAddHandler()
        }, (error) => {
          message.error(error, 7)
          this.setState({ loading: false })
        })
      })
    }
    render() {
        const { getFieldProps, getFieldValue } = this.props.form
        getFieldProps('keys', {
            initialValue: ['A'],
        })
        const formItems = getFieldValue('keys').map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`${k}：`} key={k}>
                    <Input {...getFieldProps(`${k}`, {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请填写选项！'
                                }],
                            })} style={{ width: '80%', marginRight: 8 }}
                    />
                    <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>} {...getFieldProps(`key${k}`, {valuePropName: 'checked'})} />
                </Form.Item>
            )
        })
        return (
            <Spin spinning = {this.state.loading}>
                      <Form horizontal onSubmit = {this.submitHandler}>
                          <FormItem label = '试题' {...formItemLayout} hasFeedback required>
                              <Input type="textarea" rows = {8} {...getFieldProps('question', {
                                rules: [{
                                  required: true,
                                  whitespace: true,
                                  message: '请填写试题'
                                }]
                              })} />
                          </FormItem>
                          <FormItem label = '试题图片' {...formItemLayout}>
                              <Upload
                                action={UPLOAD_COVER_API}
                                onChange={this.changeHandler}
                                name = 'upload_file'
                                fileList = {this.state.fileList}
                              >
                                <Button type="ghost">
                                  <Icon type="upload" /> 点击上传
                                </Button>
                              </Upload>
                          </FormItem>
                          {formItems}
                          <FormItem wrapperCol={{ offset: 6 }}>
                              <Button onClick={this.add} style={{ marginRight: 8 }}>新增选项</Button>
                              <Button onClick={this.remove} style={{ marginRight: 8 }}>删除选项</Button>
                              <Button type="primary" htmlType="submit">保存</Button>
                          </FormItem>
                      </Form>
            </Spin>
        );
    }
}

export default Form.create()(Add);
