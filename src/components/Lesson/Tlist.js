import React,{Component,PropTypes} from 'react'
import { Row, Col, Pagination, Spin, message } from 'antd'
import LessonCard from './LessonCard.js'
import { connect } from 'react-redux'

class List extends Component {
    state = {
        loading: true,
        list:  [],
        total: 0
    }
    componentWillMount() {
        const { userId, getList, getInfo } = this.props
        getInfo({
            role_list: '2,3',
            state: 1,
            account_id: userId
        }, total => this.setState({ total }), error => message.error(error))
        getList({
            role_list: '2,3',
            state: 1,
            account_id: userId,
            limit: 9, offset: 1
        }, list => this.setState({ list, loading: false }), error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    render(){
        const {
            list, loading, total, getList            
        } = this.state
        return(
            <Spin spinning={loading}>
                <Row gutter={16}>
                {
                    list.map(item=>{
                        return (<Col key={item.id} span={8}>
                                  <LessonCard lesson={item} />
                               </Col>)
                    })
                }
                </Row>
                {
                    total === 0 ? <div style={{textAlign: 'center'}}>暂无数据</div> :
                    <Pagination total={total} pageSize={9} showTotal={total => `共${total}条`} onChange={
                        offset =>  getList({
                            offset, limit: 9, 
                            role_list: '2,3',
                            state: 1,
                            account_id: this.props.userId
                        }, list => this.setState({ list, loading: false }), error => {
                            this.setState({ loading: false })
                            message.error(error)
                        })
                    }/>
                }
            </Spin>
        )
    }
}

List.propTypes = {
    getList: PropTypes.func.isRequired,
    getInfo: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired
}

export default connect(
    state => ({
        userId: state.auth.key
    }),
    dispatch => ({
        getInfo: (params, resolve, reject) => {
            dispatch({
                type: 'lessonteam/info',
                payload: {
                    params, resolve, reject
                }
            })
        },
        getList: (params, resolve, reject) => {
            dispatch({
                type: 'lessonteam/list',
                payload: {
                    params, resolve, reject
                }
            })
        }
    })
)(List)