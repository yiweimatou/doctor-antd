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
            pageParams
        } = list
        return(
            <div>
                <Row gutter={16}>
                {
                    list.data.map(lesson=>{
                        return (<Col key={lesson.id} span={8}>
                                  <LessonCard lesson={lesson} />
                               </Col>)
                    })
                }
                </Row>
                {
                    list.data.length > 0?
                        <div className='pagination'>
                            <Pagination 
                                total={ total }
                                showTotal={total => `共 ${total} 条`}
                                pageSize = {6}
                                onChange = {(page)=>changeHandler(page,pageParams.account_id,pageParams)}
                            />
                        </div>:
                        <p style={{textAlign: 'center'}}>没有数据</p>
                }
            </div>
        )
    }
}

export default List