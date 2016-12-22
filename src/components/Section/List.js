import React,{ Component,PropTypes } from 'react'
import {
    Table, Button, Popconfirm, message, Select
} from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { keyToName, keyToDisplayname } from '../../utils'
import { TOPICS } from '../../constants/api'
import Paper from '../Paper'
import LessonBar from '../Lesson/LessonBar'
import OrganizeBar from '../Organize/organize_bar'
import ChooseBar from '../Section/ChooseBar'
const Option = Select.Option

class List extends Component{
    static propTypes = {
        getInfo: PropTypes.func.isRequired,
        getList: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        total: PropTypes.number.isRequired,
        list: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    }
    selectHandler = value => {
        const { getList, query, getInfo } = this.props
        getInfo({
            state: 1,
            lesson_id: query.lid,
            organize_id: query.oid,
            category_id: value
        }, null, error => message.error(error))
        getList({
            limit: 9,
            offset: 1,
            state: 1,
            lesson_id: query.lid,
            organize_id: query.oid,
            category_id: value,
            sort: 'desc',
            order_by: 'add_ms'
        }, null, error => message.error(error))
    }
    componentWillMount() {
      const { getInfo, getList, query } = this.props
      getInfo({ lesson_id: query.lid, organize_id: query.oid , state: 1 }, null, error => message.error(error))
      getList({ offset: 1, limit: 9, lesson_id: query.lid, organize_id: query.oid , state: 1, sort: 'desc',order_by: 'add_ms' },
      null, error => message.error(error))
    }
    handleConfirm= id => {
        this.props.delete({ id }, () => message.success('删除成功'), error => message.error(error))
    }
    render(){
        const {
            query, total, getList, push, list, organize
        } = this.props
        const lesson_id = query.lid
        const organize_id = query.oid
        const pagination = {
            pageSize: 9,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                getList({
                  offset: current, limit: 9, lesson_id, state: 1, organize_id, sort: 'desc',order_by: 'add_ms'
                },null, error => message.error(error, 6))
            }
        }
        const columns = [{
            title:'课程资源标题',
            dataIndex:'title',
            key:'title'
        }, {
            title:'更新时间',
            dataIndex:'put_ms',
            key:'put_ms',
            render: text => new Date(text*1000).toLocaleString()
        }, {
            title: '资源类型',
            dataIndex: 'category_id',
            key: 'category_id',
            render: text => keyToDisplayname(text)
        }, {
            title:'操作',
            key:'operation',
            render: (text,record) =>
                <div>
                    { record.category_id == TOPICS ?
                    <Button type='ghost' onClick={() => push(`/paper/list?id=${record.id}`)}>查看详情</Button>:
                    <Button
                        type = 'ghost'
                        onClick={() =>
                            push(`/section/add/${keyToName(record.category_id)}?oid=${record.organize_id}&lid=${record.lesson_id}&id=${record.id}&edit=1`)
                        }
                    >编辑</Button>
                    }
                    <span className='ant-divider'></span>
                    <Popconfirm
                        title="确定要删除这个文章吗？"
                        onConfirm={()=>this.handleConfirm(record.id)}
                    >
                        <Button type = 'ghost'>删除</Button>
                    </Popconfirm>
                </div>
        }]
        return(
            <div style={{margin:10}}>
                <Paper>
                    <div style={{marginBottom: 10}}>
                        { organize_id > 0 ?
                            <OrganizeBar organize={organize} selectedKey="section" /> : <LessonBar lid={lesson_id} current='section' />
                        }
                    </div>
                </Paper>
                <div style={{margin: '20px 0', height: '30px'}}>
                    <div style={{float: 'left'}}>
                        <span>资源类型</span>
                        <Select defaultValue='null' sbyle={{margin: '0 10px'}} size="large" onSelect={this.selectHandler}>
                            <Option value='null'>全部</Option>
                            <Option value='5'>云板书</Option>
                            <Option value='6'>试卷</Option>
                            <Option value='10'>通知</Option>
                            <Option value='9'>图文</Option>
                            <Option value='8'>活动</Option>
                        </Select>
                    </div>
                    <div style={{float: 'right'}}>
                        <ChooseBar lid={ lesson_id } oid={organize_id}/>
                    </div>
                </div>
                <hr style={{margin: '20px 0'}}/>
                <Table
                    dataSource = {list}
                    columns = { columns }
                    pagination = {{
                      ...pagination,
                      total: total
                    }}
                />
            </div>
        )
    }
}

export default connect(state => ({
  list: state.section.list,
  loading: state.section.loading,
  total: state.section.total,
  query: state.routing.locationBeforeTransitions.query,
  organize: state.organize.entity
}), dispatch => ({
  push: path => dispatch(push(path)),
  getInfo: (params, resolve, reject) => dispatch({
      type: 'section/info',
      payload: {
          params, resolve, reject
      }
  }),
  getList: (params, resolve, reject) => dispatch({
      type: 'section/list',
      payload: {
          params, resolve, reject
      }
  }),
//   edit: (params, resolve, reject) => dispatch({
//       type: 'section/edit',
//       payload: { params, resolve, reject }
//   }),
  delete: (params, resolve, reject) => dispatch({
      type: 'section/delete',
      payload: {
          params, resolve, reject
      }
  }),
}))(List)
