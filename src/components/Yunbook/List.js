import React,{Component,PropTypes} from 'react'
import { connect } from 'react-redux'
import { Row,Col,Pagination, Spin, message} from 'antd'
import YunbookCard from './YunbookCard'

class List extends Component {
    state = {
        list: [],
        loading: true
    }
    static propTypes = {
        fetchYunbookList: PropTypes.func.isRequired,
        uid: PropTypes.number
    }
    changeHandler = (offset, limit, account_id) => {
        this.setState({ loading: true })
        this.props.fetchYunbookList({ offset, limit, account_id },
         list => this.setState({ list, loading: false }),
         error => message.error(error))
    }
    componentWillMount() {
        this.props.fetchYunbookInfo(
            { account_id: this.props.uid }, 
            total => this.setState({ total }),
            error => message.error(error)
        )
        this.props.fetchYunbookList({
            limit: 6,
            offset: 1,
            account_id: this.props.uid
        }, list => {
            this.setState({ list, loading: false })
        }, error => message.error(error))
    }
    render(){
        const {
            uid
        } = this.props
        return(
            <Spin spinning ={this.state.loading}>
            <div>
                <Row gutter={16}>
                {
                    this.state.list.map(yunbook=>{
                        return (<Col key={yunbook.id} span={8}>
                                  <YunbookCard yunbook={yunbook} />
                               </Col>)
                    })
                }
                </Row>
                {this.state.total ?
                    <div className='pagination'>
                        <Pagination 
                            defaultCurrent={1}
                            total={this.state.total}
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
        uid:state.auth.key
    }),
    dispatch=>({
        fetchYunbookList:(params, resolve, reject)=>{
            dispatch({
                type:'yunbook/fetchlist',
                payload: params,
                meta: {
                    resolve, reject
                }
            })
        },
        fetchYunbookInfo(params, resolve, reject) {
            dispatch({
                type: 'yunbook/fetchinfo',
                payload: params,
                meta: {
                    resolve, reject
                }
            })
        }
    })
)(List)