import React, { Component } from 'react'
import { Button, Modal } from 'antd'
import help from '../../services/help'

class Help extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      title: '',
      visible: false
    }
  }
  
  componentWillMount() {
    help.get({ id: this.props.help_id }).then(data => {
      this.setState({
        content: data.get.content,
        title: data.get.title
      })
    })
  }
  
  visibleToggle = () => this.setState(prevState => ({
    visible: !prevState.visible
  }))

  render () {
    const { content, title, visible } = this.state 
    let style = this.props.style
    if (!style) {
      style = { position: 'absolute', top: 115, right: 75, zIndex: 100 }
    }
    return (
      <div style={ style }>
        <Button type="primary" onClick={this.visibleToggle}>帮助</Button>
        <Modal title={title} onOk={this.visibleToggle} onCancel={this.visibleToggle} visible={visible}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Modal>
      </div>
    )
  }
}

Help.propTypes = {
  help_id: React.PropTypes.number.isRequired
}

export default Help