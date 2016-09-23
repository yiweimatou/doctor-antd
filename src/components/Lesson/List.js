import React, { Component, PropTypes } from 'react'
import {
    Row, Col, Pagination, Tabs, Spin, message
} from 'antd'
import LessonCard from './LessonCard.js'

const TabPane = Tabs.TabPane
class List extends Component{
    state = {
      total: 0,
      loading: true
    }
    static propTypes = {
        list: PropTypes.array.isRequired,
        changeHandler: PropTypes.func.isRequired,
        userId: PropTypes.number.isRequired,
        getLessonInfo: PropTypes.func.isRequired
    }
    handleChange = offset => {
      this.props.changeHandler({
        role: 1,
        state: 1,
        account_id: this.props.userId,
        limit: 9,
        offset
      }, () => this.setState({ loading: false }), error => {
        this.setState({ loading: false })
        message.error(error)
      })
    }
    componentWillMount() {
      const { userId, getLessonInfo } = this.props
      getLessonInfo({
        role: 1,//1:主讲,2:辅导员,3:助教
        state: 1,//1:正常,2:冻结,3:删除,
        account_id: userId
      }, total => this.setState({ total }))
      this.handleChange(1)
    }
    render(){
        const {
            list
        } = this.props
        const { total, loading } = this.state
        return(
            <Tabs defaultActiveKey = '1'>
                <TabPane tab = '已上架课程' key = '1'>
                  <Spin spinning={loading}>
                    <Row gutter={16}>
                    {
                        list.map(lesson => {
                            return (<Col key = {lesson.id} span= {8}>
                                    <LessonCard lesson = {lesson} />
                                </Col>)
                        })
                    }
                    </Row>
                    {
                        total > 0?
                            <div className='pagination'>
                                <Pagination
                                    total={ total }
                                    showTotal={total => `共 ${total} 条`}
                                    pageSize = {9}
                                    onChange = {this.handleChange}
                                />
                            </div>:
                            <p style={{textAlign: 'center'}}>没有数据</p>
                    }
                  </Spin>
                </TabPane>
            </Tabs>
        )
    }
}

export default List
