import React, {Component,PropTypes} from 'react'
import { Form, Button, Input, Modal, Radio, Spin, message } from 'antd'
import QRCode from 'qrcode.react'
// import alipayImage from '../images/alipay.gif'
import wxImage from '../images/weixin.gif'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}
const RadioGroup = Radio.Group
class Recharge extends Component {
   state = {
     url: '',
     visible: false,
     loading: false,
     record: {}
   }
   tick = () => {
     const { record } = this.state
       if(record.dispose === 3){
         clearInterval(this.interval)
         message.success('充值成功!')
         this.setState({ visible: false })
       }else {
         this.props.fetch({ id: record.id }, record => this.setState({record}))
       }
   }
<<<<<<< Updated upstream
  
=======

>>>>>>> Stashed changes
   onSubmit = (e) => {
     e.preventDefault()
     this.props.form.validateFields( (errors, values) => {
       if(errors) return
         this.props.recharge({
           way: 3,
           trade_amount: values.money*100,
           foreign_id: this.props.foreignId
         }, ({url, id}) => {
           this.interval = setInterval(this.tick,2000)
           this.setState({ url, visible: true, record: { id } })}, error => message.error(error, 6))
       })
   }
   componentWillUnmount() {
     if (this.interval){
       clearInterval(this.interval)
     }
   }
   handleCancel = () => {
     if (this.interval){
       clearInterval(this.interval)
     }
     this.setState({ visible: false })
   }
    render(){
      const { form } = this.props
<<<<<<< Updated upstream
      const { getFieldProps } = form
=======
      const { getFieldDecorator } = form
>>>>>>> Stashed changes
      return(
        <div>
          <Modal title = '扫一扫' visible= {this.state.visible} footer = {null}
            onCancel={this.handleCancel}
            maskClosable = {false}
          >
            <div style = {{ textAlign: 'center' }}>
              <QRCode size={ 256 } value = {this.state.url} level='Q'/>
            </div>
          </Modal>
          <Spin spinning = { this.state.loading }>
          <Form horizontal onSubmit = { this.onSubmit }>
              <FormItem {...formItemLayout} label='充值金额'>
<<<<<<< Updated upstream
                  <Input addonAfter = '元' type='number' {...getFieldProps('money', { rules: [{
=======
                  <Input addonAfter = '元' type='number' {...getFieldDecorator('money', { rules: [{
>>>>>>> Stashed changes
                      required: true, message: '请填写充值金额'
                    }, {
                      validator: (rule, value, callback) => {
                        if(value <= 0){
                          callback('金额必须大于零!')
                        }else {
                          callback()
                        }
                      }
                    }]})}
                  />
              </FormItem>
              <FormItem wrapperCol = {{ offset: 6 }}>
<<<<<<< Updated upstream
                  <RadioGroup {...getFieldProps('payType',{ initialValue: 2 })}>
=======
                  <RadioGroup {...getFieldDecorator('payType',{ initialValue: 2 })}>
>>>>>>> Stashed changes
                      <Radio value={2}><img src={wxImage} width='100%' /></Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem wrapperCol={ { offset: 6 } }>
                  <Button type='primary' htmlType='submit'>确定</Button>
              </FormItem>
          </Form>
          </Spin>
        </div>
      )
    }
}

Recharge.propTypes = {
  recharge: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired,
  foreignId: PropTypes.number.isRequired
}

export default Form.create()(Recharge)
