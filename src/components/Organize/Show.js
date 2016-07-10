import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row,Col } from 'antd'
import './Show.css'
import OrganzieLessonList from './OrganzieLessonList.js'

class Show extends Component {
    render(){
        const {
            organize,list,pageParams,changeHandler,edit
        } = this.props
        if( !organize ){
            return null
        }
        return(
            <div>
                <Paper>
                    <div className='row'>
                        <Row gutter={ 24 }>
                            <Col span={6}>
                                <img alt='pic' src={organize.logo} />
                            </Col>
                            <Col span={18}>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>机构名称:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{organize.oname}</span>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>机构简介:</span>
                                    </Col>
                                    <Col span={20}>
                                        <p>{organize.descript}</p>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>创建时间:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{new Date(organize.add_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>更新时间:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{new Date(organize.put_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <div className='row'>
                            <OrganzieLessonList
                                 list={list}
                                 pageParams={pageParams}
                                 changeHandler={changeHandler}
                                 edit={edit}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }
}

Show.propTypes = {
    organize:PropTypes.object,
    list:PropTypes.array,
    pageParams:PropTypes.object,
    changeHandler:PropTypes.func,
    edit:PropTypes.func
}

export default Show