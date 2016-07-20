import React, {Component,PropTypes} from 'react';
import {
    Table
} from 'antd'
import {
    connect
} from 'react-redux'

class RecommendList extends Component {
    static propTypes = {
        list:PropTypes.array,
        pageParams:PropTypes.object,
        uid:PropTypes.number
    }
    render() {
        const {
            list,pageParams,changeHandler,uid
        } = this.props
        const pagination = {
            total:pageParams.total,
            defaultPageSize:pageParams.limit,
            showTotal:total => `共 ${total} 条`,
            onChange(current){
                changeHandler(current,pageParams.limit,uid)
            }
        }
        const columns = [{
            title:'课程标题',
            dataIndex:'lname',
            key:'lname'
        }, {
            title:'被推荐人',
            dataIndex:'cname',
            key:'cname'
        }, {
            title:'推荐时间',
            dataIndex:'add_ms',
            key:'add_ms',
            render:text => new Date(text*1000).toLocaleString()
        }, {
            title:'状态',
            dataIndex:'cet',
            key:'cet',
            render:text => {
                switch(text){
                    case 1:
                        return '未认证'
                    case 2:
                        return '认证中'
                    case 3:
                        return '认证失败'
                    case 4:
                        return '认证成功'
                }
            }
        }]
        return (
            <div style={{margin:10}}>
                <Table
                    dataSource = { list }
                    columns = { columns }
                    pagination = { pagination }
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        pageParams:{
            total:state.lesson.list.total,
            limit:state.lesson.list.pageParams.limit
        },
        list:state.lesson.list.data
    }),
    dispatch => ({
        changeHandler(offset,limit,rcmd_uid){
            dispatch({
                type:'lesson/list',
                payload:{
                    rcmd_uid,
                    offset,
                    limit
                }
            })
        }
    })
)(RecommendList)