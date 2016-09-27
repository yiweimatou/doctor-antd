import React, {Component, PropTypes} from 'react';
import { Table, message, Popconfirm, Button } from 'antd'
import { connect } from 'react-redux'

class List extends Component {
    state = {
        list: [],
        total: 0,
        loading: true
    }
    handleConfirm = id => {
        this.setState({ loading: true })
        this.props.deleteTopics({ id }, () => {
            this.setState({
                list: this.state.list.filter(i => i === id),
                total: this.state.total - 1,
                loading: false 
            })
        }, error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    componentWillMount() {
        const { getInfo, userId } = this.props
        getInfo({
            account_id: userId, state_list: '1,2'
        }, total => this.setState({ total }), error => message.error(error))
        this.handdlerChange(1)
    }
    handdlerChange = offset => {
        const { changeHandler, userId } = this.props
        changeHandler({
            account_id: userId,
            offset, limit: 9,
            state_list: '1,2'
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
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: text => text === 1 ? '正常': '冻结'
        }, {
            title: '操作',
            key: 'opreation',
            render: (text, record) => 
                    <Popconfirm
                        title="确定要删除这个试卷吗？"
                        onConfirm={()=>this.handleConfirm(record.id)}
                    >
                        <Button type = 'ghost'>删除</Button>
                    </Popconfirm>
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
    userId: PropTypes.number.isRequired,
    deleteTopics: PropTypes.func.isRequired
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
        },
        deleteTopics:  (params, resolve, reject) => {
            dispatch({
                type: 'topics/delete',
                payload: { params, resolve, reject }
            })
        }
    })
)(List);