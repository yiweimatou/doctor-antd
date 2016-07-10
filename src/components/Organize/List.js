import React,{ Component,PropTypes } from 'react'
import OrganizeCard from './OrganizeCard.js'
import { Row, Col,Pagination } from 'antd'
import './List.css'

class List extends Component{
    render(){
        const {
            pageParams,list,changeHandler
        } = this.props
        return(
            <div>
                <Row gutter={16}>
                {
                    list.map(organize=>{
                        return (<Col key={organize.oid} span={8}>
                                  <OrganizeCard organize={organize} />
                               </Col>)
                    })
                }
                </Row>
                <div className='pagination'>
                    <Pagination 
                        total={pageParams.total}
                        showTotal={total => `共 ${total} 条`}
                        defaultPageSize = {pageParams.limit}
                        onChange = {(page)=>changeHandler(page,pageParams.limit,pageParams.uid)}
                    />
                </div>
            </div>
        )
    }
}

List.propTypes = {
    list:PropTypes.array,
    pageParams:PropTypes.object,
    changeHandler:PropTypes.func.isRequired
}

export default List