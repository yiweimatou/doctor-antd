import React, {Component, PropTypes} from 'react';
import {Table, message} from 'antd'
import {list, info}from '../../../services/source'
import {IMAGE} from '../../../constants/api'

class ImageSelect extends Component {
    state = {
        loading: true,
        total: 0,
        list: []
    }
    componentWillMount() {
        info({state: 1, category_id: IMAGE}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 9,
            offset,
            category_id: IMAGE
        }).then(data => {
            this.setState({
                loading: false,
                list: data.list
            })
        }).catch(error => message.error(error))
    }
    render() {
        const { total, loading, list } = this.state
        const { onChange } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            total: total,
            onChange: offset => this._getList(offset)
        }
        const columns = [{
            title: '名称',
            key: 'title',
            dataIndex: 'title'
        }, {
            title: '图片',
            key: 'path',
            dataIndex: 'path',
            render: path => (<img src={path} width='100' height='80'/>)
        }]
        const rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => onChange(selectedRows[0])
        }
        return (
            <div>
                <Table dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection}/>
            </div>
        );
    }
}

ImageSelect.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default ImageSelect
