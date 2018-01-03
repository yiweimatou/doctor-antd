import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Table, message } from 'antd'


class Show extends Component {
    state = {
        list: [],
        total: 0,
        loading: true
    }
    componentWillMount() {
        const { getTopics, getList, query } = this.props
        getTopics({
            id: query.id,
        }, topics => {
            getList({
                id_list: topics.topic_id_list,
                limit: 1000
            }, list => this.setState({ loading: false, list }), error => {
                message.error(error)
                this.setState({ loading: false })
            })
        })
    }
    render() {
        const { list, total, loading } = this.state
        if (!this.props.query.id) {
            return (<div>参数错误</div>)
        }
        const pagination = {
            showTotal: total => `共${total}条`,
            pageSize: 9
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
            <Table rowKey="id" columns={columns} dataSource={list} loading={loading} pagination={
                {
                    ...pagination, total
                }
            }/>
        );
    }
}

Show.propTypes = {
    query: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    getTopics: PropTypes.func.isRequired
};

export default connect(
    state => ({
        query: state.routing.locationBeforeTransitions.query
    }),
    dispatch => ({
        getList: (params, resolve, reject) => {
            dispatch({
                type: 'topic/list',
                payload: {
                    params, resolve, reject
                }
            })
        },
        getTopics: (params, resolve, reject) => {
            dispatch({
                type: 'topics/get',
                payload: {
                    params, resolve, reject
                }
            })
        },
    })
)(Show);
