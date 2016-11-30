import React, { Component } from 'react'
import { TEXT } from '../../../constants/api'
import TextSelect from '../../Resource/Text/Select'
import { Modal, Button } from 'antd'


class TextButton extends Component {
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
        this.props.okHandler(this.state.record)
        this.toggleVisible()
    }
    render() {
        const { visible } = this.state
        return (
                <Button onClick={this.toggleVisible}>
                    <Modal
                        visible={visible}
                        title="选择名词"
                        onOk={this.okHandler}
                        onCancel={this.toggleVisible}
                        maskClosable={false}
                    >
                        <TextSelect category={TEXT} onChange={this.changeHandler} />
                    </Modal>
                    添加名词
                </Button>
        )
    }
}

export default TextButton