import React, {Component,PropTypes} from 'react'
import { connect } from 'react-redux'
import { Form } from 'antd'

class Recharge extends Component {
    render(){
      return(
        <Form>
        
        </Form>
      )
    }
}

Recharge.propTypes = {
  recharge: PropTypes.func.isRequired
}

export default connect()(Recharge)
