import React, { Component, PropTypes } from 'react';
import { Table, Modal, message, Input, Button } from 'antd'
import { getUserList, info } from '../../../services/user'

class UserSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: true,
            total: 0,
            selected: null,
            mobile: '',
            cname: ''
        }
    }
    componentWillMount() {
        this.searchHandler()
    }
    changeHandler = (offset) => {
        this.setState({ loading: true })
        getUserList({ state: 1, offset, limit: 6, mobile: this.state.mobile, cname: this.state.cname })
        .then(data => this.setState({ dataSource: data.list, loading: false }))
        .catch((error) => {
            this.setState({ loading: false })
            message.error(error)
        })
    }
    searchHandler = () => {
        info({ state: 1, mobile: this.state.mobile, cname: this.state.cname }).then((data) => {
            this.setState({ total: data.count })
            if (data.count === 0) {
                this.setState({ dataSource: [] })
            } else {
                this.changeHandler(1)
            }
        }).catch(error => message.error(error))
    }
    render() {
        const { visible, selectHandler, cancelHandler } = this.props
        const { dataSource, loading, total, selected, cname, mobile } = this.state
        const rowSelection = {
            type: 'radio',
            onChange: (selectRowkeys, selectedRows) => this.setState({ selected: selectedRows[0] })
        }
        const columns = [{
            title: '昵称',
            dataIndex: 'cname',
            key: 'cname'
        }, {
            title: '认证姓名',
            dataIndex: 'cet_cname',
            key: 'cet_cname'
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile'
        }]
        const pagination = {
            total,
            pageSize: 6,
            showTotal: num => `共${num}条`,
            onChange: offset => this.changeHandler(offset)
        }
        return (
            <Modal
              title="选择用户"
              visible={visible} onOk={() => {
                    if (!selected) {
                        message.error('请选择一名用户!')
                    } else {
                        selectHandler(selected)
                    }
            }} onCancel={cancelHandler} maskClosable={false}
            >
                <Input
                  value={mobile}
                  placeholder="请输入手机号码"
                  onChange={e => this.setState({ mobile: e.target.value })}
                  style={{ width: 200, marginBottom: 10 }}
                />
                 <Input
                   placeholder="请输入用户昵称"
                   value={cname}
                   onChange={e => this.setState({ cname: e.target.value })}
                   style={{ width: 200, margin: '0 0 10px 10px' }}
                 />
                 <Button style={{ margin: '0 0 10px 10px' }} onClick={this.searchHandler}>搜索</Button>
                <Table rowKey="id" dataSource={dataSource} loading={loading} columns={columns} rowSelection={rowSelection} pagination={pagination} />
            </Modal>
        );
    }
}

UserSelector.propTypes = {
    selectHandler: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    cancelHandler: PropTypes.func.isRequired
};

export default UserSelector
