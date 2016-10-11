import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Table, message } from 'antd'

class List extends Component {
    render() {
        const { total, list, getList, id } = this.props
        const pagination = {
            total,
            showTotal: total => `共${total}条`,
            onChange: offset => getList({
                offset, limit: 9, section_id: id
            }, null, error =>  message.error(error))
        }
        const columns = [{
            title: '答题人',
            key: 'user',
            dataIndex: 'user'
        }, {
            title: '答对题数',
            dataIndex: 'right_num',
            key: 'right_num'
        }, {
            title: '答题时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }]
        return (
            <Table pagination={pagination} columns={columns} dataSource={list}/>
        );
    }
}

List.propTypes = {
    list: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    getList: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};

export default connect(
    state => ({
        list: state.paper.list,
        id: state.routing.locationBeforeTransitions.query.id,
        total: state.paper.total
    }),
    dispatch => ({
        getList: (params, resolve, reject) => dispatch({
            type: 'paper/list',
            payload: { params, resolve, reject }
        })
    })
)(List);