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
        changeHandler:PropTypes.func.isRequired,
        id:PropTypes.number
    }
    render(){
        const {
            list,changeHandler,id            
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
                    pageParams?
                        <div className='pagination'>
                            <Pagination 
                                total={total}
                                showTotal={total => `共 ${total} 条`}
                                defaultPageSize = {pageParams.limit}
                                onChange = {(page)=>changeHandler(page,id,pageParams)}
                            />
                        </div>:null
                }
            </div>
        )
    }
}

export default List