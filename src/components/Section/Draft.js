import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { Table, Button, Popconfirm, message, Select } from 'antd'
import { push } from 'react-router-redux'
import { keyToName, keyToDisplayname } from '../../utils'
// import Paper from '../Paper'
import LessonBar from '../Lesson/LessonBar'
import OrganizeBar from '../Organize/organize_bar'
import ChooseBar from './ChooseBar'
const Option = Select.Option

class Draft extends Component {
    handleConfirm =  id => {
        this.props.deleteSection({ id }, () => {
            message.success('删除成功')
        }, error => message.error(error))
    }
    selectHandler = value => {
        const { changeHandler, query, getInfo } = this.props
        getInfo({
            state: 2,
            lesson_id: query.lid,
            organize_id: query.oid,
            category_id: value
        }, null, error => message.error(error))
        changeHandler({
            limit: 9,
            offset: 1,
            state: 2,
            lesson_id: query.lid,
            organize_id: query.oid,
            category_id: value,
            sort: 'desc',
            order_by: 'add_ms'
        }, null, error => message.error(error))
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
            }, null, error => message.error(error))
        }
        const columns = [{
            title: '课程资源标题',
            dataIndex: 'title',
            key: 'title'
        }, {
            title:'更新时间',
            dataIndex:'put_ms',
            key:'put_ms',
            render:text=>new Date(text*1000).toLocaleString()
        }, {
            title: '资源类型',
            dataIndex: 'category_id',
            key: 'category_id',
            render: text => keyToDisplayname(text)
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
             <div style={{marginBottom: 10}}>
                {query.lid > 0 ?
                    <LessonBar lid={query.lid} current='draft' />: <OrganizeBar selectedKey="draft" organize={this.props.organize}/>
                }
                <div style={{margin: '20px 0', height: '30px'}}>
                    <div style={{float: 'left'}}>
                        <span>资讯类型</span>
                        <Select defaultValue='null' style={{margin: '0 10px'}} size="large" onSelect={this.selectHandler}>
                            <Option value='null'>全部</Option>
                            <Option value='5'>云板书</Option>
                            <Option value='6'>试卷</Option>
                            <Option value='10'>通知</Option>
                            <Option value='9'>图文</Option>
                            <Option value='8'>活动</Option>
                        </Select>
                    </div>
                    <div style={{float: 'right'}}>
                        <Button onClick = {() => push(`/task/add/${ query.lid }`)} className='marginLeft' type='ghost' size='large'>请求创建图文</Button>
                        <ChooseBar lid={ query.lid } oid={query.oid}/>
                    </div>
                </div>
                <hr style={{margin: '20px 0'}}/>
                <Table rowKey="id" loading={loading} dataSource={list} columns={columns} pagination={{
                    ...pagination,
                    total
                }}/>
            </div>
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
    query: PropTypes.object.isRequired,
    getInfo: PropTypes.func.isRequired,
    organize: PropTypes.object.isRequired,
};

export default connect(state => ({
    loading: state.section.loading,
    list: state.section.list,
    total: state.section.total,
    query: state.routing.locationBeforeTransitions.query,
    organize: state.organize.entity
}), dispatch => ({
    push: path => dispatch(push(path)),
    deleteSection: (params, resolve, reject) => dispatch({
        type: 'section/delete',
        payload: { params, resolve, reject }
    }),
    changeHandler: (params, resolve, reject) => dispatch({
        type: 'section/list',
        payload: { params, resolve, reject }
    }),
    getInfo: (params, resolve, reject) => dispatch({
        type: 'section/info',
        payload: { params, resolve, reject }
    })
}))(Draft);
