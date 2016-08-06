import React,{Component,PropTypes} from 'react'
import {
    Row,
    Col,
    Pagination
} from 'antd'
import LessonCard from './LessonCard.js'

class List extends Component{
    static propTypes = {
        list:PropTypes.object,
        changeHandler:PropTypes.func.isRequired
    }
    render(){
        const {
            list,changeHandler            
        } = this.props
        const {
            total,
            params
        } = list
        return(
            <div>
                <Row gutter={16}>
                {
                    list.data.map(item=>{
                        return (<Col key={item.lesson.id} span={8}>
                                  <LessonCard lesson={item.lesson} />
                               </Col>)
                    })
                }
                </Row>
                {
                    params?
                        <div className='pagination'>
                            <Pagination 
                                total={total}
                                showTotal={total => `共 ${total} 条`}
                                defaultPageSize = {params.limit}
                                onChange = {(page)=>changeHandler(page,params.account_id,params)}
                            />
                        </div>:null
                }
            </div>
        )
    }
}

export default List