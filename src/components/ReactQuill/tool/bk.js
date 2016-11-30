import React, { Component } from 'react'
import { BAIKE } from '../../../constants/api'
import { Modal, Button } from 'antd'
import LinkSelect from '../../Resource/LinkSelect'

class BaikeButton extends Component {
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
                <Button style={{ marginLeft: '5px' }} onClick={this.toggleVisible}>
                    <Modal
                        visible={visible}
                        title="选择百科"
                        onOk={this.okHandler}
                        onCancel={this.toggleVisible}
                        maskClosable={false}
                    >
                        <LinkSelect category={BAIKE} onChange={this.changeHandler} />
                    </Modal>
                添加百科</Button>
        )
    }
}

export default BaikeButton