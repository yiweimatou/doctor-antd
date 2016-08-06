import React,{ Component,PropTypes } from 'react'
import OrganizeCard from './OrganizeCard.js'
import { Row, Col,Pagination } from 'antd'
import styles from './List.css'

class List extends Component{
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
                {list.length>0?
                <div className={styles.pagination}>
                    <Pagination 
                        total={params.total}
                        showTotal={total => `共 ${total} 条`}
                        defaultPageSize = {params.limit}
                        onChange = {(page)=>changeHandler(page,params.limit,params.account_id)}
                    />
                </div>:null
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