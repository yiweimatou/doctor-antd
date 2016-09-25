import React, {Component, PropTypes} from 'react';
import { Table, message } from 'antd'
import { connect } from 'react-redux'

class List extends Component {
    state = {
        list: [],
        total: 0,
        loading: true
    }
    componentWillMount() {
        const { getInfo, userId } = this.props
        getInfo({
            account_id: userId
        }, total => this.setState({ total }), error => message.error(error))
        this.handdlerChange(1)
    }
    handdlerChange = offset => {
        const { changeHandler, userId } = this.props
        changeHandler({
            account_id: userId,
            offset, limit: 9
        }, list => this.setState({ loading: false, list }), error => message.error(error))
    }
    render() {
        const { list, total, loading } = this.state
        const pagination = {
            showTotal: total => `共${total}条`,
            pageSize: 9,
            onChange: offset => this.handdlerChange(offset)
        }
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                return (<a href={`/textpaper/show?id=${record.id}`}>{text}</a>)
            }
        }, {
            title: '价格',
            dataIndex: 'sale_amount',
            key: 'sale_amount',
            render: text => `${text/100}元`
        }]
        return (
            <Table dataSource={list} loading={loading} columns={columns} pagination = {{
                ...pagination,
                total
            }} />
        );
    }
}

List.propTypes = {
    getInfo: PropTypes.func.isRequired,
    changeHandler: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired
};

export default connect(
    state => ({
        userId: state.auth.key
    }),
    dispatch => ({
        getInfo: (params, resolve, reject) => {
            dispatch({
                type: 'topics/info',
                payload: { params, resolve, reject }
            })
        },
        changeHandler: (params, resolve, reject) => {
            dispatch({
                type: 'topics/list',
                payload: { params, resolve, reject }
            })
        }
    })
)(List);