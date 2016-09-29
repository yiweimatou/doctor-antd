import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row, Col, Button, message } from 'antd'
import './Show.css'
import OrganzieLessonList from './OrganzieLessonList.js'
import { DEFAULT_COVER, DEFAULT_FACE } from '../../constants/api'

class Show extends Component {
    state: {
        list: [],
        total: 0,
        loading: true,
        organize_team: {},
        team_list: []
    }
    changeHandler = offset => {
        const { id, getLessonList } = this.props
        getLessonList({
            offset, limit: 9, organize_id: id, state: 1
        }, list => this.setState({ list, loading: false }), error => {
            this.setState({ loading: false })
            message.error(error)
        })
    }
    componetWillMount() {
        const { id, getInfo, getOrganizeTeam, userId, getOrganizeTeamList } = this.props
        getInfo({
            organize_id: id, state: 1
        }, total => this.setState({ total }), error => message.error(error))
        this.changeHandler(1)
        getOrganizeTeam({
            organize_id: id,
            account_id: userId, 
            state: 1
        }, organize_team => this.setState({ organize_team }), error => message.error(error))
        getOrganizeTeamList({
            organize_id: id,
            state: 1,
            offset: 1,
            limit: 100
        }, list => this.setState({ team_list:  list }), error => message.error(error))
    }
    render(){
        const {
            organize, push
        } = this.props
        const { team_list } = this.state
        return(
            <div>
                <Paper>
                    <div className='row'>
                        <Row gutter={16}>
                            <Col span={6}>
                                <img width='100%' alt='pic' src={(organize&&organize.cover) || DEFAULT_COVER} />
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={3}><span>机构名称:</span></Col>
                                    <Col span={4}><span>{organize&&organize.title}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3}><span>机构简介:</span></Col>
                                    <Col span={8}><p>{organize&&organize.descript}</p></Col>
                                </Row>
                                <Row>
                                    <Col span={3}><span>创建时间:</span></Col>
                                    <Col span={8}><span>{organize&&new Date(organize.add_ms*1000).toLocaleString()}</span></Col>
                                </Row>
                                <Row>
                                    <Col span={3}><span>更新时间:</span></Col>
                                    <Col span={8}><span>{organize&&new Date(organize.put_ms*1000).toLocaleString()}</span></Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={16}>
                                <span>机构余额:<em style={{color:'orange',fontSize:'200%'}}>{organize&&organize.balance_amount}</em>元</span>
                            </Col>
                            <Col span={4}>
                                <Button type='primary' onClick={()=>push(`/organize/recharge/${organize.id}`)}>充值</Button>
                            </Col>
                            <Col span={4}>
                                <Button type='ghost' onClick = {() => push(`/organize/bill/${organize.id}`)}>交易明细</Button>
                            </Col>
                        </Row>
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <h2>团队成员</h2>
                      {
                        team_list.map(item=>{
                          return(
                            <div nowrap key={item.id} className='item'>
                              <img
                                src={  item.face ||  DEFAULT_FACE }
                                className='img'
                                width='100%'
                              />
                              {
                                item.role === 1 ?
                                  <em className='bar'>主讲</em>:''
                              }
                              <span className='span'>{item.cname || item.mobile}</span>
                            </div>
                          )
                        })
                      }
                    </Paper>
                </div>
                <div className='paper'>
                    <Paper>
                        
                    </Paper>
                </div>
            </div>
        )
    }
}

Show.propTypes = {
    organize: PropTypes.object.isRequired,
    getLessonList: PropTypes.func.isRequired,
    getOrganizeTeam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    userId: PropTypes.number.isRequired,
    getOrganizeTeamList: PropTypes.func.isRequired
}

export default Show
