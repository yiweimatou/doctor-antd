import React, { Component } from 'react';
import { Form, Input, Button, message, Switch, Upload, Icon, Spin, } from 'antd';
import Category from '../Category'
import { TOPIC } from '../../constants/api'
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
      fileList: [],
      category: '',
      latLng: {}
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
        if (answer === '') return message.error('至少要有一个答案')
        const category = this.state.category
        if (category.length > 0 && category.length < 3) {
            return message.error('请再选择一级分类')
        }
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
        this.props.add(params, topic => {
          message.success('新增成功', 5)
          this.setState({ loading: false })
          this.props.form.resetFields()
          this.props.afterAddHandler()
          if (category.length >= 3) {
            this.props.grow({
                lat: this.state.latLng.lat,
                lng: this.state.latLng.lng,
                title: values.question,
                state: 1,
                category_id: TOPIC,
                foreign_id: topic.id,
                // cover: cover,
                map_id: 1,
                kind: category[0] === '1' ? category[1] : category[2]
            }, null, error => message.error(error))
          }
        }, (error) => {
          message.error(error, 7)
          this.setState({ loading: false })
        })
      })
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form
        getFieldDecorator('keys', {
            initialValue: ['A'],
        })
        const formItems = getFieldValue('keys').map((k) => {
            return (
                <Form.Item {...formItemLayout} label={`${k}：`} key={k}>
                    {getFieldDecorator(`${k}`, {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: '请填写选项！'
                                }],
                            })(<Input style={{ width: '80%', marginRight: 8 }} />)}
                    {getFieldDecorator(`key${k}`, {valuePropName: 'checked'})(
                        <Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross"/>} />
                    )} 
                </Form.Item>
            )
        })
        return (
            <Spin spinning = {this.state.loading}>
                      <Form horizontal onSubmit = {this.submitHandler}>
                          <FormItem label = '试题' {...formItemLayout} hasFeedback required>
                              {getFieldDecorator('question', {
                                rules: [{
                                  required: true,
                                  whitespace: true,
                                  message: '请填写试题'
                                }]
                              })(<Input type="textarea" rows = {8} />)}
                          </FormItem>
                          <FormItem label = '分类' {...formItemLayout}>
                            <Category onChange={(value, latLng) => this.setState({category: value, latLng})}/>
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
