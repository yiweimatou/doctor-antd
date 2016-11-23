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
        }]
        return (
            <Table pagination={pagination} columns={columns} dataSource={list}/>
        );
    }
}

List.propTypes = {
    list: PropTypes.object.isRequired,
    total: PropTypes.number.isRequired,
    getList: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};

export default connect(
    state => ({
        list: state.papers.list,
        id: state.routing.locationBeforeTransitions.query.id
    }),
    dispatch => ({
        getList: (params, resolve, reject) => dispatch({
            type: 'papers/list',
            payload: { params, resolve, reject }
        })
    })
)(List);