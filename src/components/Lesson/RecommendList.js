import React, {Component,PropTypes} from 'react';
import {
    Table
} from 'antd'
import {
    connect
} from 'react-redux'

class RecommendList extends Component {
    static propTypes = {
        list:PropTypes.object,
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
            dataIndex:'title',
            key:'title'
        }, {
            title:'被推荐人',
            key:'cname',
            render: (text,record) => {
                if(list.otherInfos.users){
                    const user = list.otherInfos.users[record.account_id]
                    if(user){
                        return user.cname || user.mobile
                    }
                }
                return ''
            }
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
                    case 2:
                        return '推荐中'
                    case 3:
                        return '推荐失败'
                    case 4:
                        return '推荐成功'
                }
            }
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

export default connect(
    state => ({
        pageParams:{
            total:state.lesson.list.total,
            limit:state.lesson.list.pageParams.limit
        },
        list:state.lesson.list
    }),
    dispatch => ({
        changeHandler(offset,limit,rcmd_account_id){
            dispatch({
                type:'lesson/list',
                payload:{
                    rcmd_account_id,
                    offset,
                    limit
                }
            })
        }
    })
)(RecommendList)