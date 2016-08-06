import React, {
    Component,
    PropTypes
} from 'react'
import {
    Table,Button
} from 'antd'
import { Link } from 'react-router'

class OrganizeLessonList extends Component {
    static propTypes = {
        list:PropTypes.object,
        edit:PropTypes.func,
        changeHandler:PropTypes.func
    }
    render(){
        const {
            list,edit,changeHandler
        } = this.props
        const pagination = {
            total: list.total,
            defaultPageSize:list.params.limit,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                changeHandler(current,list.params.limit)
            }
        }
        const columns = [{
            title: '课程名称',
            dataIndex: 'lesson_name',
            key: 'lesson_name',
            render : (text, record) => (<Link to={`/lesson/show/${record.lesson_id}`}>{text}</Link>)
        },{
            title: '认证金额',
            dataIndex: 'organize_money',
            key: 'organize_money'
        }, {
            title:'申请时间',
            dataIndex:'add_ms',
            key:'add_ms',
            render:function(text){
                return new Date(text*1000).toLocaleString()
            }
        }, {
            title:'状态',
            key:'cet',
            dataIndex:'cet',
            render:(text)=>{
                switch (text) {
                    case 1:
                        return '未认证'
                    case 2:
                        return '认证中'
                    case 3:
                        return '认证失败'
                    case 4:
                        return '认证成功'
                    default:
                        return ''
                }
            }
        }, {
            title:'操作',
            key:'operation',
            render: (text,record)=>(
                record.cet<3?
                <div>
                    <Button 
                        type = 'ghost'
                        onClick={()=>edit(true,record.id)}
                    >
                        同意
                    </Button>
                    <span className="ant-divider"></span>
                    <Button 
                        type = 'ghost'
                        onClick={()=>edit(false,record.id)}
                    >
                        拒绝
                    </Button>
                </div>:''
            )
        }]
        return (
            <Table
                dataSource={list.data}
                columns = { columns } 
                pagination = { pagination }
            />
        )
    }
}

export default OrganizeLessonList