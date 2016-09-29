import React,{Component,PropTypes} from 'react'
import { connect } from 'react-redux'
import { Row,Col,Pagination, Spin, message} from 'antd'
import YunbookCard from './YunbookCard'

class List extends Component {
    static propTypes = {
        fetchYunbookList: PropTypes.func.isRequired,
        uid: PropTypes.number
    }
    changeHandler = (offset, limit, account_id) => {
        this.props.fetchYunbookList({ offset, limit, account_id },
         null,
         error => message.error(error))
    }
    componentWillMount() {
        this.props.fetchYunbookInfo(
            { account_id: this.props.uid }, 
            null,
            error => message.error(error)
        )
        this.props.fetchYunbookList({
            limit: 6,
            offset: 1,
            account_id: this.props.uid
        }, null, error => message.error(error))
    }
    render(){
        const {
            loading, list, total, uid
        } = this.props
        return(
            <Spin spinning ={loading}>
            <div>
                <Row gutter={16}>
                {
                    list.map(yunbook=>{
                        return (<Col key={yunbook.id} span={8}>
                                  <YunbookCard yunbook={yunbook} />
                               </Col>)
                    })
                }
                </Row>
                {total ?
                    <div className='pagination'>
                        <Pagination 
                            total={total}
                            showTotal={total => `共 ${total} 条`}
                            pageSize = {6}
                            onChange = {page=> this.changeHandler(page, 6, uid)}
                        />
                    </div>:
                    <p style={{textAlign: 'center'}}>暂无数据</p>
                }
            </div>
            </Spin>
        )
    }
}

export default connect(
    state=>({
        uid:state.auth.key,
        loading: state.yunbook.myLoading,
        total: state.yunbook.myTotal,
        list: state.yunbook.mylist
    }),
    dispatch=>({
        fetchYunbookList:(params, resolve, reject)=>{
            dispatch({
                type:'yunbook/mylist',
                payload: params,
                resolve, reject
            })
        },
        fetchYunbookInfo(params, resolve, reject) {
            dispatch({
                type: 'yunbook/myinfo',
                payload: params,
                resolve, reject
            })
        }
    })
)(List)