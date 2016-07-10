import React, {
    Component,
    PropTypes
} from 'react'
import {
    Table,Button
} from 'antd'


class OrganizeLessonList extends Component {
    static propTypes = {
        list:PropTypes.array,
        edit:PropTypes.func,
        pageParams:PropTypes.object,
        changeHandler:PropTypes.func
    }
    render(){
        const {
            list,edit,pageParams,changeHandler
        } = this.props
        const pagination = {
            total: pageParams.total,
            defaultPageSize:pageParams.limit,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                changeHandler(current,pageParams.limit)
            }
        }
        const columns = [{
            title: '课程名称',
            dataIndex: 'lname',
            key: 'lname'
        }, {
            title:'主讲人',
            dataIndex:'admin_cname',
            key:'admin_cname'
        }, {
            title:'主讲手机号码',
            dataIndex:'admin_mobile',
            key:'admin_mobile'
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
                dataSource={list}
                columns = { columns } 
                pagination = { pagination }
            />
        )
    }
}

export default OrganizeLessonList