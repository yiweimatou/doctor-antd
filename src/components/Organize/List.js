import React,{ Component,PropTypes } from 'react'
import OrganizeCard from './OrganizeCard.js'
import { Row, Col, Pagination, message, Spin, Tabs } from 'antd'
import { info } from '../../services/organizeTeam'
import styles from './List.css'

const TabPane = Tabs.TabPane
class List extends Component{
    state = {
        list: [],
        loading: true,
        total: 0,
        total2: 0,
        list2: [],
        loading2: true
    }
    componentWillMount() {
        const { userId } = this.props
        info({ role: 1, account_id: userId, state: 1 }).then(data => {
            this.setState({ total: data.count })
            if (data.count > 0) {
                console.log(1111)
                this.getList(1, 1)
            } else {
                this.setState({ loading: false })
            }
        })
        info({ role: 2, account_id: userId, state: 1 }).then(data => {
            this.setState({ total2: data.count })
            if (data.count > 0) {
                this.getList(1, 2)
            } else {
                this.setState({ loading2: false })
            }
        })
    }

    getList = (offset, role) => {
        const { changeHandler, userId } = this.props
        changeHandler({
            limit: 9, offset, account_id: userId, state: 1, role
        }, list => {
            console.log(role, list)
            if (role === 1) {

                this.setState({ list, loading: false })
            } else {
                this.setState({ list2: list, loading2: false })
            }
        }, error => {
            message.error(error)
            this.setState({ loading2: false, loading: false })
        })
    }

    render(){
        const { list, loading, list2, loading2, total, total2 } = this.state
        return(
            <Tabs defaultActiveKey="1">
                <TabPane tab="超级管理员" key="1">
                    <Spin spinning={loading}>
                        <Row gutter={16}>
                        {
                            list.map(organize => {
                                return (<Col key={organize.id} span={7}>
                                        <OrganizeCard organize={organize} />
                                    </Col>)
                            })
                        }
                        </Row>
                        <div className={styles.pagination}>
                        { total > 0 ?                
                            <Pagination 
                                total={total}
                                showTotal={total => `共 ${total} 条`}
                                pageSize = {9}
                                onChange = {offset => this.getList(offset, 1)}
                            /> : 
                            <p style = {{textAlign: 'center'}}>暂无数据</p>
                        }
                        </div>
                    </Spin>
                </TabPane>
                <TabPane tab="普通管理员" key="2">
                    <Spin spinning={loading2}>
                        <Row gutter={16}>
                        {
                            list2.map(organize => {
                                return (<Col key={organize.id} span={7}>
                                        <OrganizeCard organize={organize} />
                                    </Col>)
                            })
                        }
                        </Row>
                        <div className={styles.pagination}>
                        { total2 > 0 ?                
                            <Pagination 
                                total={total2}
                                showTotal={total => `共 ${total} 条`}
                                pageSize = {9}
                                onChange = {offset => this.getList(offset, 2)}
                            /> : 
                            <p style = {{textAlign: 'center'}}>暂无数据</p>
                        }
                        </div>
                    </Spin>
                </TabPane>
            </Tabs>
        )
    }
}

List.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired
}

export default List