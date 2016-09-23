import React,{ Component,PropTypes } from 'react'
import {
    Table, Button, Popconfirm, message
} from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { keyToName } from '../../utils'

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
            lesson_id, total, dispatch, push, list
        } = this.props
        const pagination = {
            pageSize: 9,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                dispatch('section/list', {
                  offset: current, limit: 9, lesson_id, state: 1
                })
            }
        }
        const columns = [{
            title:'文章标题',
            dataIndex:'title',
            key:'title'
        }, {
            title:'更新时间',
            dataIndex:'put_ms',
            key:'put_ms',
            render:text=>new Date(text*1000).toLocaleString()
        },{
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
  total: state.section.total
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
  delete: (params, resolve, reject) => dispatch({
      type: 'section/delete',
      payload: {
          params, resolve, reject
      }
  }),
}))(List)
