import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row,Col,Button } from 'antd'
import './Show.css'
import OrganzieLessonList from './OrganzieLessonList.js'

class Show extends Component {
    render(){
        const {
            organize,list,changeHandler,edit,push
        } = this.props
        return(
            <div>
                <Paper>
                    <div className='row'>
                        <Row gutter={16}>
                            <Col span={6}>
                                <img width='100%' alt='pic' src={organize&&organize.logo} />
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={3}>
                                        <span>机构名称:</span>
                                    </Col>
                                    <Col span={4}>
                                        <span>{organize&&organize.title}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3}>
                                        <span>机构简介:</span>
                                    </Col>
                                    <Col span={8}>
                                        <p>{organize&&organize.descript}</p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3}>
                                        <span>创建时间:</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>{organize&&new Date(organize.add_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={3}>
                                        <span>更新时间:</span>
                                    </Col>
                                    <Col span={8}>
                                        <span>{organize&&new Date(organize.put_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <span>机构余额:
                                    <em style={{color:'orange',fontSize:'200%'}}>{organize&&organize.amount_money}</em>元
                                </span>
                            </Col>
                            <Col span={4}>
                                <Button type='primary'>
                                    充值
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button type='ghost' onClick = {() => push(`/organize/money/${organize.id}`)}>
                                    交易明细
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <div className='row'>
                            <OrganzieLessonList
                                 list={list}
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
    list:PropTypes.object,
    changeHandler:PropTypes.func,
    edit:PropTypes.func,
    push: PropTypes.func
}

export default Show