import React,{Component,PropTypes} from 'react'
import { connect } from 'react-redux'
import { Row,Col,Pagination, Spin, message, Modal } from 'antd'
import LessonSelect from '../Lesson/select'
import YunbookCard from './YunbookCard'
import { push, replace } from 'react-router-redux'

class List extends Component {
    static propTypes = {
        fetchYunbookList: PropTypes.func.isRequired,
        // uid: PropTypes.number
    }
    state = {
        visible: false,
        record: {},
        yid: 0
    }
    changeHandler = (offset, account_id) => {
        this.props.fetchYunbookList({ offset, limit: 6, account_id }, () => {
            this.props.replace(`/yunbook/manage?page=${offset}`)
        },error => message.error(error))
    }
    componentWillMount() {
        this.props.fetchYunbookInfo(
            { account_id: this.props.uid }, 
            null,
            error => message.error(error)
        )
        let offset = 1
        if(this.props.query.page) {
            offset = this.props.query.page
        }
        this.props.fetchYunbookList({
            limit: 6,
            offset,
            account_id: this.props.uid
        }, null, error => message.error(error))
    }
    toggleVisible = () => this.setState((prevState) => ({
        visible: !prevState.visible
    }))
    okHandler = () => {
        this.toggleVisible()
        const { record, yid } = this.state
        this.props.go(`/section/add/book?lid=${record.id}&oid=0&yid=${yid}`)
    }
    render(){
        const {
            loading, list, total, uid, query
        } = this.props
        let page = 1
        if (query.page) {
            page = parseInt(query.page, 10)
        }
        const pagination = {
            total,
            defaultPageSize: 6,
            defaultCurrent: page,
            showTotal: total => `共 ${total} 条`,
            onChange: offset => this.changeHandler(offset, uid)
        }
        return(
            <Spin spinning ={loading}>
                <Modal title="选择课程" visible={this.state.visible} maskClosable={false} onOk={this.okHandler} onCancel={this.toggleVisible}>
                    <LessonSelect onChange={record => this.setState({ record })}/>
                </Modal>
                <div>
                    <Row gutter={16}>
                    {
                        list.map(yunbook=>{
                            return (<Col key={yunbook.id} span={8}>
                                        <YunbookCard onClick={ () => {
                                                this.toggleVisible()
                                                this.setState({ yid: yunbook.id })
                                            }
                                        } yunbook={yunbook} />
                                    </Col>
                                )
                        })
                    }
                    </Row>
                    {total ?
                        <div className='pagination'>
                            <Pagination {...pagination}/>
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
        uid: state.auth.key,
        loading: state.yunbook.myLoading,
        total: state.yunbook.myTotal,
        list: state.yunbook.mylist,
        query: state.routing.locationBeforeTransitions.query
    }),
    dispatch=>({
        fetchYunbookList:(params, resolve, reject)=>{
            dispatch({
                type:'yunbook/mylist',
                resolve,
                payload: params, reject
            })
        },
        fetchYunbookInfo(params, resolve, reject) {
            dispatch({
                type: 'yunbook/myinfo',
                payload: params,
                resolve, reject
            })
        },
        replace: path => dispatch(replace(path)),
        go: path => dispatch(push(path))
    })
)(List)