import React, { Component, PropTypes } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import RefereeSelect from '../referee_select'
import { isMobile } from '../../../../utils'

const FormItem = Form.Item
const formItemLayout = {
    wrapperCol: {
        span: 12
    },
    labelCol: {
        span: 6
    }
}
class SalerEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      referee_cname: '',
      referee_account_id: 0,
      visible:false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.referee_account_id === 0 && nextProps.saler.referee_account_id > 0) {
      this.setState({
        referee_account_id: nextProps.saler.referee_account_id,
        referee_cname: nextProps.saler.referee_cname
      })
    }
  }
  
  okHandler = () => {
    this.props.form.validateFields((erros, values) => {
      if (erros) return
      const params = {
        cname: values.cname,
        unit: values.unit,
        mobile: values.mobile,
        remark: values.remark ? values.remark : '',
        id: this.props.saler.id,
        referee_account_id: this.state.referee_account_id
      }
      this.props.edit(params).then(() => {
        this.props.form.resetFields()
        this.setState({
          referee_cname: '',
          referee_account_id: 0
        })
      })
    })
  }

  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  onSelect = referee => this.setState({
      referee_account_id: referee.account_id,
      referee_cname: referee.cname,
      visible: false
  })

  render() {
    const { visible, onCancel, saler } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title="编辑销售"
        maskClosable={false}
        visible={visible}
        onOk={this.okHandler}
        onCancel={onCancel}
      >
        <Form>
          <FormItem label="医药代表" {...formItemLayout}>
            <span style={{ marginRight: 10 }}>{this.state.referee_cname}</span>
            <Button onClick={this.visibleToggle}>更换医药代表</Button>
            <RefereeSelect 
              visible={this.state.visible}
              onSelect={this.onSelect}
              onCancel={this.visibleToggle}
              id={saler.organize_id}
            />
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
              { getFieldDecorator('cname', { initialValue: saler.cname })(<Input type="text"/>)}
            </FormItem>
            <FormItem label="单位" {...formItemLayout}>
              { getFieldDecorator('unit', { initialValue: saler.unit })(<Input type="text"/>)}
            </FormItem>
            <FormItem label="电话" {...formItemLayout}>
              { getFieldDecorator('mobile', {
                initialValue: saler.mobile,
                rules: [
                  { validator: (rule, value, callback) => {
                    if (value) {
                      if (isMobile(value)) {
                        callback()
                      } else {
                        callback('请输入正确的手机号码')
                      }
                    }
                  }}
                ]
              })(<Input type="text"/>)}
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              { getFieldDecorator('remark', { initialValue: saler.remark })(<Input type="textarea"/>)}
            </FormItem>
        </Form>
      </Modal>
    )
  }
}

SalerEdit.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
};

export default Form.create()(SalerEdit)