import React, { Component, PropTypes } from 'react'
import { Modal, Form, Input, message } from 'antd'
import ImgUploader from '../../ImgUploader'
import { UPLOAD_LOGO_API } from '../../../constants/api'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class ProductEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coverFileList: [],
      logoFileList: []
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { cover, logo } = nextProps.product
    this.setState({
      coverFileList: cover && this.state.coverFileList.length === 0 ? [
        { uid: -1, name: '封面',status: 'done', url: cover }
      ]: [],
      logoFileList: logo && this.state.logoFileList.length === 0 ? [
        { uid: -2, name: 'logo',status: 'done', url: logo }
      ]: []
    })
  }
  
  submitHandler = () => {
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      let cover = '', logo = ''
      if (this.state.coverFileList.length > 0) {
        cover = this.state.coverFileList[0].url
      }
      if (this.state.logoFileList.length > 0) {
        logo = this.state.logoFileList[0].url
      }
      const params = {
        title: values.title,
        descript: values.descript ? values.descript : '',
        remark: values.remark ? values.remark : '',
        cover, logo, id: this.props.product.id
      }
      this.props.onOk(params).then(() => {
        this.props.form.resetFields()
        this.setState({ coverFileList: [], logoFileList: [] })
      }).catch(err => message.error(err))
    })
  }
  render() {
    const { onCancle, visible, product } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Modal visible={visible} title="编辑产品" onCancel={onCancle} onOk={this.submitHandler} maskClosable={false} width={720}>
        <Form>
          <FormItem label="产品名称" {...formItemLayout}>
            {getFieldDecorator('title', { 
              rules: [
                { required: true , message: '请填写产品名称' }
              ],
              initialValue: product.title
            })(<Input type="text" />)}
          </FormItem>
          <FormItem label="封面" {...formItemLayout}>
            <ImgUploader fileList={this.state.coverFileList} onChange={ list => this.setState({ coverFileList: list }) } />
          </FormItem>
          <FormItem label="logo" {...formItemLayout}>
            <ImgUploader fileList={this.state.logoFileList} action={UPLOAD_LOGO_API} onChange={ list => this.setState({logoFileList: list }) }/>
          </FormItem>
          <FormItem label="简介" {...formItemLayout}>
            {getFieldDecorator('descript', { initialValue: product.descript })(<Input type="textarea" />)}
          </FormItem>
          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remark', { initialValue: product.remark })(<Input type="textarea"/>)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

ProductEdit.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancle: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default Form.create()(ProductEdit)