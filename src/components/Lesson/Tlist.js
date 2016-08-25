import React,{Component,PropTypes} from 'react'
import {
    Row,
    Col,
    Pagination
} from 'antd'
import LessonCard from './LessonCard.js'

class List extends Component{
    static propTypes = {
        list:PropTypes.object
    }
    render(){
        const {
            list            
        } = this.props
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
            </div>
        )
    }
}

export default List