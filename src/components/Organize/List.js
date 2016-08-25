import React,{ Component,PropTypes } from 'react'
import OrganizeCard from './OrganizeCard.js'
import { Row, Col,Pagination } from 'antd'
import styles from './List.css'

class List extends Component{
    state = {
        current: 1
    }
    render(){
        const {
            params,list,changeHandler
        } = this.props
        return(
            <div>
                <Row gutter={16}>
                {
                    list.map(organize=>{
                        return (<Col key={organize.id} span={7}>
                                  <OrganizeCard organize={organize} />
                               </Col>)
                    })
                }
                </Row>
                <div className={styles.pagination}>
                {list.length>0?                
                    <Pagination 
                        total={params.total}
                        showTotal={total => `共 ${total} 条`}
                        current = { this.state.current }
                        pageSize = {params.limit}
                        onChange = {
                            page => {
                                changeHandler(page,params.limit,params.account_id)
                                this.setState({
                                    current: page
                                })
                            }
                        }
                    /> : 
                    <p style = {{textAlign: 'center'}}>暂无数据</p>
                }
                </div>
                }
            </div>
        )
    }
}

List.propTypes = {
    list:PropTypes.array,
    params:PropTypes.object,
    changeHandler:PropTypes.func.isRequired
}

export default List