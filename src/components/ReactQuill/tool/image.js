import React, { Component } from 'react'
import { Modal, Button, message } from 'antd'
import ImageSelect from '../../Resource/Image/Select'

class ImageButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            record: {}
        }
        this.toggleVisible = this.toggleVisible.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.okHandler = this.okHandler.bind(this)
    }
    
    toggleVisible() {
        this.setState((prevState) => ({
            visible: !prevState.visible
        }))
    }
    changeHandler(record) {
        this.setState({
            record
        })
    }
    okHandler() {
        if (this.state.record.id > 0) {
            this.props.okHandler(this.state.record)
            this.toggleVisible()
         } else {
            message.error('请选择一项!')
        }
    }
    render() {
        const { visible } = this.state
        return (
                <Button style={{ marginLeft: '5px' }} onClick={this.toggleVisible}>
                    <Modal
                        visible={visible}
                        title="选择图片"
                        onOk={this.okHandler}
                        onCancel={this.toggleVisible}
                        maskClosable={false}
                    >
                        <ImageSelect onChange={this.changeHandler} />
                    </Modal>
                    添加图片
                </Button>
        )
    }
}

export default ImageButton