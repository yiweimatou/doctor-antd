import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row,Col } from 'antd'
import './Show.css'

class Show extends Component {
    render(){
        const {
            organize
        } = this.props
        return(
            <div>
                {organize?
                    <Paper>
                        <div className='row'>
                            <Row gutter={ 24 }>
                                <Col span={12}>
                                    <img alt='pic' src={organize.logo} />
                                </Col>
                                <Col span={12}>
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
                                            <p>{organize.oname}</p>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={4}>
                                            <span>机构名称:</span>
                                        </Col>
                                        <Col span={20}>
                                            <span>{organize.oname}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Paper>
                    :''
                }
            </div>
        )
    }
}

Show.propTypes = {
    organize:PropTypes.object
}

export default Show