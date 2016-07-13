import React,{ Component,PropTypes } from 'react'
import {
    Table,Button,Popconfirm
} from 'antd'


class List extends Component{
    static propTypes = {
        list:PropTypes.array,
        push:PropTypes.func,
        pageParams:PropTypes.object,
        changeHandler:PropTypes.func,
        lid:PropTypes.number,
        deleteSection:PropTypes.func.isRequired
    }
    handleConfirm=(sid)=>{
        this.props.deleteSection(sid)
    }
    render(){
        const {
            list,pageParams,changeHandler,lid,push
        } = this.props
        const pagination = {
            total: pageParams.total,
            defaultPageSize:pageParams.limit,
            showTotal:total=>`共 ${total} 条`,
            onChange(current) {
                changeHandler(current,pageParams.limit,lid)
            }
        }
        const columns = [{
            title:'文章标题',
            dataIndex:'sname',
            key:'sname'
        }, {
            title:'状态',
            dataIndex:'status',
            key:'status',
            render:text=>{
                switch (text){
                    case 1:
                        return '隐藏'
                    case 2:
                        return '正常'
                    case 3:
                        return '删除'
                }
            }
        }, {
            title:'更新时间',
            dataIndex:'put_ms',
            key:'put_ms',
            render:text=>new Date(text*1000).toLocaleString()
        },{
            title:'操作',
            key:'operation',
            render: (text,record)=>(
                record.status===3?null:
                <div>
                    <Button 
                        type = 'ghost'
                        onClick={()=>push(`/section/edit/${record.sid}`)}
                    >
                        编辑
                    </Button>
                    <span className="ant-divider"></span>
                    <Popconfirm 
                        title="确定要删除这个文章吗？" 
                        onConfirm={()=>this.handleConfirm(record.sid)}
                    >
                        <Button type = 'ghost'>删除</Button>
                    </Popconfirm>
                </div>
            )
        }]
        return(
            <div style={{margin:10}}>
                <Table
                    dataSource = {list}
                    columns = { columns }
                    pagination = {pagination}
                />
            </div>
        )
    }
}

export default List