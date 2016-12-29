import React, { Component } from 'react';
import { message } from 'antd'
import UserSelector from '../../User/selector';
import record_share from '../../../services/record_share';

class AddShare extends Component {
    constructor(props) {
        super(props)
        this.selectHandler = this.selectHandler.bind(this)
    }
    selectHandler(user) {
        record_share.add({ record_id: this.props.item.id, share_account_id: user.id }).then(() => {
            message.success('分享成功！')
            this.props.onCancel()
        }).catch(error => {
            message.error(error)
        })
    }
    render() {
        const { visible, onCancel } = this.props
        return (
            <UserSelector visible={visible} cancelHandler={onCancel} selectHandler={this.selectHandler} />
        );
    }
}

export default AddShare;