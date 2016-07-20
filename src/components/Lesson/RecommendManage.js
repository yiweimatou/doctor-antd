import React, {Component, PropTypes} from 'react';
import {
    connect 
} from 'react-redux'
import {
    Table,Button,Popconfirm
} from 'antd'

class RecommendManage extends Component {
    handleConfirm = (cet,lid) => {
        this.props.edit(cet,lid)
    }
    render() {
        const {
            list,changeHandler,uid
        } = this.props
        const pagination = {
            total:list.total,
            defaultPageSize:list.pageParams.limit,
            showTotal:total => `共 ${total} 条`,
            onChange(current){
                changeHandler(current,list.pageParams.limit,uid)
            }
        }
        const columns = [{
            title:'课程标题',
            dataIndex:'lname',
            key:'lname'
        }, {
            title:'推荐时间',
            dataIndex:'add_ms',
            key:'add_ms',
            render:text => new Date(text*1000).toLocaleString()
        }, {
            title:'操作',
            key:'operation',
            render: (text,record)=>(
                <div>
                    <Popconfirm 
                        title="确定要同意吗？" 
                        onConfirm={()=>this.handleConfirm(4,record.lid)}
                    >
                        <Button type = 'ghost'>同意</Button>
                    </Popconfirm>
                    <span className="ant-divider"></span>
                    <Popconfirm 
                        title="确定要拒绝吗？" 
                        onConfirm={()=>this.handleConfirm(3,record.lid)}
                    >
                        <Button type = 'ghost'>拒绝</Button>
                    </Popconfirm>
                </div>
            )
        }]
        return (
            <div style={{margin:10}}>
                <Table
                    dataSource = { list.data }
                    columns = { columns }
                    pagination = { pagination }
                />
            </div>
        );
    }
}

RecommendManage.propTypes = {
    list:PropTypes.object,
    changeHandler:PropTypes.func.isRequired,
    uid:PropTypes.number,
    edit:PropTypes.func.isRequired
}

export default connect(
    state => ({
        list:state.lesson.list,
        uid:state.auth.key
    }),
    dispatch => ({
        changeHandler(offset,limit,uid){
            dispatch({
                type:'lesson/list',
                payload:{
                    offset,
                    limit,
                    uid,
                    cet:2
                }
            })
        },
        edit(cet,lid){
            dispatch({
                type:'lesson/put/cet',
                payload:{
                    cet,
                    lid
                }
            })
        }
    })
)(RecommendManage)