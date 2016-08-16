import React, {Component,PropTypes} from 'react'
import { Form, Button, Input, Modal, Radio, Spin, message } from 'antd'
import QRCode from 'qrcode.react'
import alipayImage from '../images/alipay.gif'
import wxImage from '../images/weixin.gif'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
}
const RadioGroup = Radio.Group
class Recharge extends Component {
   state = {
     url: '',
     visible: false
   }
   tick = () => {
       if(this.props.record.cet === 4){
         clearInterval(this.interval)
         message.success('充值成功!')
         this.setState({ visible: false })
       }else {
         this.props.fetchOne({ id: this.props.record.id })
       }
   }
   componentWillReceiveProps(nextProps){
     if(nextProps.status.error){
       message.error(nextProps.status.error)
     }
     if(!this.props.status.isSuccess && nextProps.status.isSuccess && nextProps.record.code_url){
       this.setState({
         visible: true,
         url:nextProps.record.code_url
       })
       this.interval = setInterval(this.tick,5000)
     }
   }
   onSubmit = (e) => {
     e.preventDefault()
     this.props.form.validateFields( (errors, values) => {
       if(errors) return
       if(values.payType === 1){
         this.props.recharge({
           way: 3,
           money: values.money,
           foreign_id: this.props.foreignId
         })
       }else {
         this.props.recharge({
           way: 3,
           money: values.money,
           foreign_id: this.props.foreignId
         })
       }
     } )
   }
   handleCancel = () => this.setState({ visible: false })
    render(){
      const { form,status } = this.props
      const { getFieldProps } = form
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
          <Spin spinning = { status.pending }>
          <Form horizontal form={ form } onSubmit = { this.onSubmit }>
              <FormItem {...formItemLayout} label='充值金额' hasFeedback>
                  <Input type='number' {...getFieldProps('money', { rules: [{
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
              <FormItem wrapperCol = {{ span: 16, offset: 4 }}>
                  <RadioGroup {...getFieldProps('payType',{ initialValue: 1 })}>
                      <Radio value={1}><img src={alipayImage} width='100%'/></Radio>
                      <Radio value={2}><img src={wxImage} width='100%' /></Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem wrapperCol={ { span: 16, offset: 4 } }>
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
  form: PropTypes.object.isRequired,
  foreignId: PropTypes.number.isRequired,
  status: PropTypes.object.isRequired,
  record: PropTypes.object
}

export default Form.create()(Recharge)
