import React, { Component } from 'react';
import { Tabs, Form, Input, Button, message, Switch, Upload, Icon, Spin, Modal } from 'antd';
import { connect } from 'react-redux'
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
}
import { UPLOAD_COVER_API } from '../../constants/api'

class Add extends Component {
    state = {
      num: 65,
      fileList: [],
      loading: false,
      uploading: false,
      success: 0,
      failure: 0,
      total: 0
    }
    componentWillMount() {
      if (!window.XLSX) {
        const head= document.getElementsByTagName('head')[0]
        const script= document.createElement('script')
        script.type= 'text/javascript'
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.8.0/xlsx.core.min.js'
        head.appendChild(script)
      }
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
    changeHandler = info => {
      let fileList =  info.fileList
      //上传列表数量的限制
      fileList = fileList.slice(-1)
      // 2. 读取远程路径并显示链接
      fileList = fileList.map((file) => {
        if (file.response) {
          // 组件会将 file.url 作为链接进行展示
          file.url = file.response.cover;
        }
        return file;
      })
      // 3. 按照服务器返回信息筛选成功上传的文件
      fileList = fileList.filter((file) => {
        if (file.response) {
          return file.response.code === 200
        }
        return true;
      })
      this.setState({ fileList })
    }
    clickHandler = () => {
      document.getElementById('file').click()
    }
    tick = () => {
      if(this.state.success + this.state.failure === this.state.total) {
        clearInterval(this.interval)
        this.setState({ uploading: false })
        Modal.info({ content: `上传:${this.state.total},成功:${this.state.success}`})
      }
    }
    fileChangeHandler = (e) => {
      this.setState({ uploading: true })
      e.preventDefault()
      const files  = e.target.files
      const ext = files[0].name.split('.').slice(-1)[0].toUpperCase()
      if (ext !== 'XLS' && ext !== 'XLSX') {
          this.setState({ uploading: false })
          return message.error('请上传EXCLE', 8)
      }
      let reader = new FileReader()
      reader.onerror = () => {
        message.error('文件读取错误!', 6)
      }
      reader.onload = e => {
        const data = e.target.result
        if (!window.XLSX) {
          return message.error('缺少组件，请刷新页面!', 8)
        }
        const workbook = window.XLSX.read(data, {type: 'binary'})
        const first_sheet_name = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[first_sheet_name]
        const _json = window.XLSX.utils.sheet_to_json(worksheet)
        this.setState({ total: _json.length })
        this.interval = setInterval(this.tick, 1000)
        _json.forEach(item => {
          this.props.add({
            state: 1,
            question: item['试题题目（标题）'],
            option1: item['备选A'] || '',
            option2: item['备选B'] || '',
            option3: item['备选C'] || '',
            option4: item['备选D'] || '',
            option5: item['备选E'] || '',
            answer: item['标准答案']
          }, () => {
            this.setState({ success: this.state.success + 1 })
          }, () => {
            this.setState({ failure: this.state.failure + 1 })
          })
        })
      }
      reader.readAsBinaryString(files[0])
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
              <Tabs defaultActiveKey = '1'>
                  <TabPane tab = '添加试题' key = '1'>
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
                          <FormItem label = '分类' {...formItemLayout}>
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
                  </TabPane>
                  <TabPane tab = '批量上传' key = '2'>
                    <Spin spinning={this.state.uploading}>
                      <div style = {{textAlign: 'center'}} >
                        <p >请根据模板格式填写Excel &nbsp;
                            <a href = "http://7xp3s1.com1.z0.glb.clouddn.com/%E9%A2%98%E5%BA%93%E6%A8%A1%E6%9D%BF.xlsx" target = '_blank'>
                                下载Excel模板
                            </a>
                        </p>
                        <a onClick={this.clickHandler} style={{display:'inline-block', width:244, height:138, lineHeight: 10, borderStyle: 'dashed'}}>
                          <Icon type="plus" style={{fontSize:'300%'}}/>
                          <input id="file" onChange={this.fileChangeHandler} type="file" style={{width:0,height:0}}/>
                        </a>
                      </div>
                    </Spin>
                  </TabPane>
              </Tabs>
            </Spin>
        );
    }
}

export default connect(null, dispatch => ({
  add: (params, resolve, reject) => {
    dispatch({
      type: 'topic/add',
      payload: {
        params, resolve, reject
      }
    })
  }
}))(Form.create()(Add));
