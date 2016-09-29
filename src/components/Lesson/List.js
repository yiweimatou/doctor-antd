import React, { Component, PropTypes } from 'react'
import {
    Row, Col, Pagination, Tabs, Spin, message
} from 'antd'
import LessonCard from './LessonCard.js'

const TabPane = Tabs.TabPane
class List extends Component{
    state = {
      loading: true,
      list1: [],
      list2: [],
      list: []
    }
    static propTypes = {
        changeHandler: PropTypes.func.isRequired,
        userId: PropTypes.number.isRequired
    }
    componentWillMount() {
      const { userId, changeHandler } = this.props
      changeHandler({
        role: 1,//1:主讲,2:辅导员,3:助教
        state: 1,//1:正常,2:冻结,3:删除,
        account_id: userId
      }, list => {
          const list1 = list.filter(i => i.state === 1)
          const list2 = list.filter(i => i.state === 2)
          this.setState({
              list1, list2, loading: false, list
          })
      }, error => message.error(error))
    }
    render(){
        const { list, list1, list2, loading } = this.state
        return(
            <Spin spinning={loading}>            
                <Tabs defaultActiveKey = '0'>
                    <TabPane tab = '全部课程' key = '0'>
                        <Row gutter={16}>
                        {
                            list.map(lesson => <Col key = {lesson.id} span= {8}><LessonCard lesson = {lesson} /></Col>)
                        }
                        </Row>
                        {
                            list.length > 0?
                                <div className='pagination'>
                                    <Pagination
                                        total={ list.length }
                                        showTotal={total => `共 ${total} 条`}
                                        pageSize = {6}
                                    />
                                </div>:
                                <p style={{textAlign: 'center'}}>没有数据</p>
                        }
                    </TabPane>
                    <TabPane tab = '已上架课程' key = '1'>
                        <Row gutter={16}>
                        {
                            list1.map(lesson => {
                                return (<Col key = {lesson.id} span= {8}>
                                        <LessonCard lesson = {lesson} />
                                    </Col>)
                            })
                        }
                        </Row>
                        {
                            list1.length > 0?
                                <div className='pagination'>
                                    <Pagination
                                        total={ list1.length }
                                        showTotal={total => `共 ${total} 条`}
                                        pageSize = {6}
                                    />
                                </div>:
                                <p style={{textAlign: 'center'}}>没有数据</p>
                        }
                    </TabPane>
                    <TabPane tab = '未上架课程' key = '2'>
                        <Row gutter={16}>
                        {
                            list2.map(lesson => {
                                return (<Col key = {lesson.id} span= {8}>
                                        <LessonCard lesson = {lesson} />
                                    </Col>)
                            })
                        }
                        </Row>
                        {
                            list2.length > 0?
                                <div className='pagination'>
                                    <Pagination
                                        total={ list2.length }
                                        showTotal={total => `共 ${total} 条`}
                                        pageSize = {6}
                                    />
                                </div>:
                                <p style={{textAlign: 'center'}}>没有数据</p>
                        }
                    </TabPane>
                </Tabs>
            </Spin>
        )
    }
}

export default List
