import React, { Component } from 'react'
import VideoSelect from '../../Resource/Video/Select'
import { Modal, Button, message } from 'antd'

class VideoButton extends Component {
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
                        title="选择视频"
                        onOk={this.okHandler}
                        onCancel={this.toggleVisible}
                        maskClosable={false}
                    >
                        <VideoSelect onChange={this.changeHandler} />
                    </Modal>
                    添加视频
                </Button>
        )
    }
}

export default VideoButton