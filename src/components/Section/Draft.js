import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Table, Button, Popconfirm, message } from 'antd'
import { push } from 'react-router-redux'
import { keyToName } from '../../utils'

class Draft extends Component {
    handleConfirm =  id => {
        this.props.deleteSection({ id }, () => {
            message.success('删除成功')
        }, error => message.error(error))
    }
    render() {
        const { loading, list, total, changeHandler, query, push } = this.props
        if (!query.oid || !query.lid) {
            return (<div>参数错误</div>)
        }
        const pagination = {
            showTotal: total => `共${total}条`,
            pageSize: 9,
            onChange: current => changeHandler({
                limit: 9,
                offset: current,
                state: 2,
                lesson_id: query.lid,
                organize_id: query.oid
            })
        }
        const columns = [{
            title: '文章标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title: '操作',
            key: 'opreation',
            render: (text, record) => 
                <div>
                    <Button type = 'ghost' onClick={() => {
                        push(`/section/add/${keyToName(record.category_id)}?lid=${record.lesson_id}&oid=${record.organize_id}&id=${record.id}`)
                    }}>编辑</Button>
                    <span className="ant-divider"></span>
                    <Popconfirm
                        title="确定要删除这个文章草稿吗？"
                        onConfirm={()=>this.handleConfirm(record.id)}
                    >
                        <Button type = 'ghost'>删除</Button>
                    </Popconfirm>
                </div>
        }]
        return (
            <Table loading={loading} dataSource={list} columns={columns} pagination={{
                ...pagination,
                total
            }}/>
        );
    }
}

Draft.propTypes = {
    loading: PropTypes.bool.isRequired,
    list: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    push: PropTypes.func.isRequired,
    changeHandler: PropTypes.func.isRequired,
    deleteSection: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
};

export default connect(state => ({
    loading: state.section.loading,
    list: state.section.list,
    total: state.section.total,
    query: state.routing.locationBeforeTransitions.query,
}), dispatch => ({
    push: path => dispatch(push(path)),
    deleteSection: (params, resolve, reject) => dispatch({
        type: 'section/delete',
        payload: { params, resolve, reject }
    }),
    changeHandler: (params, resolve, reject) => dispatch({
        type: 'section/list',
        payload: { params, resolve, reject }
    })
}))(Draft);