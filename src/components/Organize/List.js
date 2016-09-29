import React,{ Component,PropTypes } from 'react'
import OrganizeCard from './OrganizeCard.js'
import { Row, Col, Pagination, message, Spin } from 'antd'
import styles from './List.css'

class List extends Component{
    state = {
        list: [],
        loading: true
    }
    componentWillMount() {
        const { changeHandler, userId } = this.props
        changeHandler({
            limit: 9,
            offset: 1,
            account_id: userId,
            state: 1,
            role: 1
        }, list => this.setState({ list, loading:false }), error => {
            message.error(error)
            this.setState({ loading: false })
        })
    }
    render(){
        const {
            changeHandler, total
        } = this.props
        const { list, loading } = this.state
        return(
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
                        onChange = {
                            offset => changeHandler({
                                offset, limit: 9
                            }, null, error => message.error(error))}
                    /> : 
                    <p style = {{textAlign: 'center'}}>暂无数据</p>
                }
                </div>
            </Spin>
        )
    }
}

List.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired
}

export default List