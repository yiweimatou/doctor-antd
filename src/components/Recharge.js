import React, {Component,PropTypes} from 'react'
import { Form, Button, Input, Modal, Spin, message } from 'antd'
import QRCode from 'qrcode.react'
// import alipayImage from '../images/alipay.gif'
// import wxImage from '../images/weixin.gif'
import { add, get } from '../services/bill'
import { ORGANIZE, ACCOUNT } from '../constants/api'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}
// const RadioGroup = Radio.Group
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
         get({ id: record.id })
         .then(data => this.setState({ record: data.get }))
         .catch(error => {
           message.error(error)
           this.setState({ visible: false })
           clearInterval(this.interval)
         })
       }
   }
   onSubmit = (e) => {
     e.preventDefault()
     this.props.form.validateFields( (errors, values) => {
       if(errors) return
       let foreign_id, category_id
       if (this.props.organize) {
         foreign_id = this.props.organize.id
         category_id = ORGANIZE
       } else {
         foreign_id = this.props.foreignId
         category_id = ACCOUNT
       }
       add({
           way: 3,
           trade_amount: values.money * 100,
           foreign_id,
           category_id
         }).then(data => {
           this.interval = setInterval(this.tick, 2000)
           this.setState({ url: data.get.code_url, visible: true, record: { id: data.identity, dispose:1 } })
         }).catch(error => message.error(error, 6))
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
      const { getFieldDecorator } = form
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
                  {getFieldDecorator('money', { rules: [{
                      required: true, message: '请填写充值金额'
                    }, {
                      validator: (rule, value, callback) => {
                        if(value <= 0){
                          callback('金额必须大于零!')
                        }else {
                          callback()
                        }
                      }
                    }]})(<Input addonAfter = '元' type='number' />)}
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
  organize: PropTypes.object
}

export default Form.create()(Recharge)
