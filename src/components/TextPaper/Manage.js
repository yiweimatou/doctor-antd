import React, {Component, PropTypes} from 'react';
import { Tabs, message } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import List from './List'
import Add from './Add'
const TabPane = Tabs.TabPane

class Manage extends Component {
    state = {
        list: [],
        total: 0,
        loading: true,
        activeKey: '1'
    }
    componentWillMount() {
        const { getInfo, userId } = this.props
        getInfo({
            account_id: userId, state_list: '1,2'
        }, total => this.setState({ total }), error => message.error(error))
        this.handleChange(1)
    }
    handleConfirm = id => {
        this.setState({ loading: true })
        this.props.deleteTopics({ id }, () => {
            this.setState({
                list: this.state.list.filter(i => i.id !== id),
                total: this.state.total - 1,
                loading: false 
            })
        }, error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    handleChange = offset => {
        const { changeHandler, userId } = this.props
        changeHandler({
            account_id: userId,
            offset, limit: 9,
            state_list: '1,2'
        }, list => this.setState({ loading: false, list }), error => message.error(error))
    }
    afterAddHandler = record => this.setState({ 
        list: [record].concat(this.state.list),
        total: this.state.total + 1,
        activeKey: '1' 
    })
    render() {
        const { loading, total, list, activeKey } = this.state
        return (
            <Tabs defaultActiveKey='1' activeKey={activeKey} onTabClick={
                activeKey => this.setState({activeKey})}>
                <TabPane tab='试卷列表' key='1'>
                    <List handleConfirm={this.handleConfirm} handleChange={this.handleChange} list={list} total={total} loading={loading} push={this.props.push}/>
                </TabPane>
                <TabPane tab='新建试卷' key='2'>
                    <Add add={this.props.addTopics} afterAddHandler={this.afterAddHandler}/>
                </TabPane>
            </Tabs>
        );
    }
}

Manage.propTypes = {
    getInfo: PropTypes.func.isRequired,
    changeHandler: PropTypes.func.isRequired,
    deleteTopics: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    addTopics: PropTypes.func.isRequired
};

export default connect(
    state => ({
        userId: state.auth.key
    }),
    dispatch => ({
        addTopics: (params, resolve, reject) => {
            dispatch({
                type: 'topics/add',
                payload: {
                    params, resolve, reject
                }
            })
        },
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
        },
        push: path => dispatch(push(path))
    })
)(Manage);