import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Table, message } from 'antd'

class List extends Component {
    render() {
        const { list, total, changeHandler, userId, loading } = this.props
        const pagination = {
            showTotal: total => `共${total}条` ,
            pageSize: 9,
            onChange: offset => changeHandler({
                offset, limit: 9, account_id: userId
            }, null, error => message.error(error))
        }
        const columns = [{
            title: '试题',
            dataIndex: 'question',
            key: 'question'
        }, {
            title: '选项A',
            dataIndex: 'option1',
            key: 'option1'
        }, {
            title: '选项B',
            dataIndex: 'option2',
            key: 'option2'
        }, {
            title: '选项C',
            dataIndex: 'option3',
            key: 'option3'
        }, {
            title: '选项D',
            dataIndex: 'option4',
            key: 'option4'
        }, {
            title: '选项E',
            dataIndex: 'option5',
            key: 'option5'
        }, {
            title: '答案',
            dataIndex: 'answer',
            key: 'answer'
        }]
        return (
            <Table dataSource={list} columns={columns} loading={loading} pagination={{
                ...pagination,
                total
            }}/>
        );
    }
}

List.propTypes = {
    list: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    total: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    changeHandler: PropTypes.func.isRequired
};

export default connect(
    state => ({
        list: state.topic.list,
        loading: state.topic.loading,
        userId: state.auth.key,
        total: state.topic.total
    }),
    dispatch => ({
        changeHandler: (params, resolve, reject) => {
            dispatch({ type: 'topic/list', payload: { params, resolve, reject }})
        }
    })
)(List);