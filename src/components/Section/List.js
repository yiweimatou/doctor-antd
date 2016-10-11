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
import ChooseBar from '../Section/ChooseBar'
const Option = Select.Option

class List extends Component{
    static propTypes = {
        getInfo: PropTypes.func.isRequired,
        getList: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
        lesson_id: PropTypes.string.isRequired,
        total: PropTypes.number.isRequired,
        list: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    }
    selectHandler = value => {
        const { getList, lesson_id, getInfo } = this.props
        getInfo({
            state: 1,
            lesson_id,
            category_id: value
        }, null, error => message.error(error))
        getList({
            limit: 9,
            offset: 1,
            state: 1,
            lesson_id,
            category_id: value
        }, null, error => message.error(error))
    }
    componentWillMount() {
      const { getInfo, getList, lesson_id } = this.props
      getInfo({ lesson_id, state: 1 }, null, error => message.error(error))
      getList({ offset: 1, limit: 9, lesson_id, state: 1 }, null, error => message.error(error))
    }
    handleConfirm= id => {
        this.props.delete({ id }, () => message.success('删除成功'), error => message.error(error))
    }
    render(){
        const {
            lesson_id, total, getList, push, list
        } = this.props
        const pagination = {
            pageSize: 9,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                getList({
                  offset: current, limit: 9, lesson_id, state: 1
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
            render:text=>new Date(text*1000).toLocaleString()
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
                    <Button
                        type = 'ghost'
                        onClick={() =>
                            push(`/section/add/${keyToName(record.category_id)}?oid=${record.organize_id}&lid=${record.lesson_id}&id=${record.id}&edit=1`)
                        }
                    >编辑</Button>
                    <span className="ant-divider"></span>
                    { record.category_id == TOPICS ?
                    <div style={{display: 'inline-block'}}><Button type='ghost' onClick={() => push(`/paper/list?id=${record.id}`)}>查看详情</Button>
                    <span className='ant-divider'></span></div>:null
                    }   
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
                        <LessonBar lid={lesson_id} current='section' />
                    </div>
                </Paper>
                <div style={{margin: '20px 0', height: '30px'}}>
                    <div style={{float: 'left'}}>
                        <span>资源类型</span>
                        <Select defaultValue='0' style={{margin: '0 10px'}} size="large" onSelect={this.selectHandler}>
                            <Option value='0'>全部</Option>
                            <Option value='5'>云板书</Option>
                            <Option value='6'>试卷</Option>
                            <Option value='10'>通知</Option>
                            <Option value='9'>图文</Option>
                            <Option value='8'>活动</Option>
                        </Select>
                    </div>
                    <div style={{float: 'right'}}>
                        <ChooseBar lid={ lesson_id }/>
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
  lesson_id: state.routing.locationBeforeTransitions.query.id
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
