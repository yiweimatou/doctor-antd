import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import {
    Table, Button, Popconfirm
} from 'antd'

class Manage extends Component {
    static propTypes ={
        team: PropTypes.object,
        handleChange: PropTypes.func,
        editTeam: PropTypes.func
    }
    handleConfirm = (agree, id) => {
        this.props.editTeam({
            id,
            cet: agree?4:3
        })
    }
    render() {
        const {
            list,
            total,
            params,
            loading
        } = this.props.team
        const pagination = {
            total,
            defaultPageSize: params.limit,
            showTotal: total => `共 ${total} 条`,
            onChange(current) {
                this.props.changeHandler(current, params)
            }
        }
        const columns = [{
            title : '课程名',
            dataIndex: 'lesson.title',
            key: 'lesson_name'
        },
        //  {
        //     title: '主讲人',
        //     dataIndex: 'user.cname',
        //     key: 'user_name'
        // }, {
        //     title: '主讲人手机号码',
        //     dataIndex: 'user.mobile',
        //     key: 'user_mobile'
        // }, 
        {
            title: '邀请时间',
            dataIndex: 'add_ms',
            key: 'add_ms',
            render: text => new Date(text*1000).toLocaleString()
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return(
                    record.cet===1?
                <div>
                    <Popconfirm 
                        title="确定要同意加入该课程么？" 
                        onConfirm={()=>this.handleConfirm(true,record.id)}
                    >
                        <Button type = 'ghost'>同意</Button>
                    </Popconfirm>
                    <span className="ant-divider"></span>
                    <Popconfirm 
                        title="确定要拒绝加入该课程么？" 
                        onConfirm={()=>this.handleConfirm(false,record.id)}
                    >
                        <Button type = 'ghost'>拒绝</Button>
                    </Popconfirm>
                </div>:null)
            }
        }]
        return (
            <div style={{margin:10}}>
                <Table
                    dataSource = { list }
                    columns = { columns }
                    pagination = { pagination }
                    loading = { loading }
                />
            </div>
        )
    }
}

export default connect(
    state => ({
        team: state.lessonTeam
    }),
    dispatch => ({
        handleChange: (offset, params) => {
            dispatch({
                type: 'lessonTeam/list',
                payload:{
                    ...params,
                    offset
                }
            })
        },
        editTeam: params => dispatch({
            type: 'lessonTeam/edit',
            payload:params
        }) 
    })
)(Manage)