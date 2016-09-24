import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row, Col, Button, Modal, message, Spin } from 'antd'
import SelectContainer from '../../containers/organize/selectContainer.js'
import './Show.css'
import SelectUser from '../User/SelectUser.js'
import TeamList from './TeamList.js'
import SectionList from '../Section/List'
import { DEFAULT_COVER, DEFAULT_FACE, DEFAULT_LOGO } from '../../constants/api'

const styles = {
    row:{
        padding:30,
        margin:'5px 0'
    }
}
class Show extends Component {
    static propTypes = {
        push: PropTypes.func.isRequired,
        changeHandler: PropTypes.func.isRequired,
        deleteSection: PropTypes.func.isRequired,
        userId: PropTypes.number.isRequired,
        handleRemove: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        getLessonTeamList: PropTypes.func.isRequired,
        getOrganizeList: PropTypes.func.isRequired,
        getLessonTeam: PropTypes.func.isRequired,
        getLesson: PropTypes.func.isRequired
    }
    state = {
        organize_list: [],
        team_list: [],
        oVisible:false,
        uVisible:false,
        tVisible:false,
        role: 0,//1:主讲,2:辅导员,3:助教
        tid: 0,
        loading: true,
        lesson: {},
        pending: true
    }
    handlerTVisible=()=>{
        this.setState({
            tVisible:!this.state.tVisible
        })
    }
    handlerUVisible=()=>{
        this.setState({
            uVisible:!this.state.uVisible
        })
    }
    handlerOVisible=()=>{
        this.setState({
            oVisible:!this.state.oVisible
        })
    }
    componentWillMount() {
      this.props.getLessonTeam({
        account_id: this.props.userId,
        lesson_id: this.props.id
      }, get => this.setState({ role: get.role, tid: get.id }), error => {
        message.error(error, 7)
      })
      this.props.getLesson({
        id: this.props.id
      }, lesson => this.setState({ lesson, loading: false }), error => message.error(error))
      this.props.getOrganizeList({
        lesson_id: this.props.id,
        state: 1
      }, list => this.setState({ organize_list: list }), error => message.error(error))
      this.props.getLessonTeamList({
        state: 1,
        lesson_id: this.props.id,
        offset: 1,
        limit: 100
      }, list => this.setState({ team_list: list.sort((i, j) => i.role - j.role) }), error => message.error(error))
      this.props.getSectionInfo({
        state: 1, lesson_id: this.props.id
      }, total => this.setState({ total }), error => message.error(error))
      this.sectionListHandler({
        state: 1,
        offset: 1,
        limit: 9,
        lesson_id: this.props.id
      })
    }
    sectionListHandler = params => {
      this.props.changeHandler(params, list => this.setState({ section_list: list }), error => message.error(error))
    }
    render(){
        const {
          push, handleRemove, id
        } = this.props
        const { role, loading, lesson, tid, organize_list, team_list } = this.state
        return(
            <div>
                <Paper>
                    <div style={styles.row}>
                      <Spin spinning={loading}>
                        <Row gutter={16}>
                            <Col span={12}><img alt='pic' width='480' height='180' src={lesson&&lesson.cover|| DEFAULT_COVER} /></Col>
                            <Col span={6}><span>课程名称:</span></Col>
                            <Col span={6}><span>{lesson&&lesson.title}</span></Col>
                            <Col span={6}><span>课程简介:</span></Col>
                            <Col span={6}><span>{lesson&&lesson.descript}</span></Col>
                            <Col span={6}><span>创建时间:</span></Col>
                            <Col span={6}><span>{lesson&&new Date(lesson.add_ms*1000).toLocaleString()}</span></Col>
                            <Col span={6}><span>更新时间:</span></Col>
                            <Col span={6}><span>{lesson&&new Date(lesson.put_ms*1000).toLocaleString()}</span></Col>
                            <Col span={6}><span>浏览量:</span></Col>
                            <Col span={6}><p>{lesson&&lesson.pv}</p></Col>
                            <Col span={6}><span>粉丝数:</span></Col>
                            <Col span={6}><p>{lesson&&lesson.uv}</p></Col>
                            <Col span = {6}><span>课程价格:</span></Col>
                            <Col span = {6}><span style={{color: 'orange'}}>{lesson&&lesson.account_amount}</span>元</Col>
                        </Row>
                      </Spin>
                    </div>
                    <div style = { styles.row } >
                        <Row>
                                    课程余额
                                    <span className='money'><em>{lesson&&lesson.balance_amount}</em></span>元
                                    <span style={{marginLeft: 30}}>
                                        每月一日0点自动分成，课程余额超过1000元部分分成
                                    </span>
                                    <br />
                                        信用账户
                                        <span className='money'><em>{lesson&&lesson.credit_amount}</em></span>元

                                        <span style={{marginLeft: 30}}>
                                            信用账户总额为1000元，课程收入优先还入信用账户
                                        </span>
                                <Button
                                    onClick = {()=>push(`/lesson/bill?id=${lesson.id}`)}
                                    type = 'ghost'
                                    style = {{ marginLeft: 30}}
                                >
                                    交易明细
                                </Button>
                        </Row>
                    </div>
                    <div style={styles.row}>
                        {role === 0 ? null:
                        <Row>
                            <Col span={4}>
                                <Button onClick = {() => push(`/lesson/edit/${id}`)} type='ghost'>
                                    编辑课程
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button type='ghost'onClick = {() => push(`/section/add/choose?lid=${id}&oid=0`)}>
                                    新建文章
                                </Button>
                            </Col>
                            {lesson.state === 1 ?
                            <Col span={4}>
                                <Button onClick={this.handlerOVisible} type='ghost'>申请机构认证</Button>
                            </Col> : null}
                            {role === 1 ?
                            <Col span={4}>
                                <Button type='ghost' onClick={this.handlerUVisible}>邀请成员</Button>
                            </Col>:null}
                            { role === 1 ?                            
                            <Col span={4}>
                                <Button type='ghost' onClick = {this.handlerTVisible}>团队管理</Button>
                                {role === 3 ?
                                <Button type='ghost' onClick={
                                  () => handleRemove({ id: tid }, () => {
                                    message.success('成功退出团队!', 6)
                                    push('/')
                                  }, error => message.error(error, 6))
                                }>退出团队</Button>:null}
                            </Col>
                            : null}
                            <Col span={4}>
                                <Button onClick={() => push(`/section/draft?lid=${id}&oid=0`)} type='ghost'>素材管理</Button>
                            </Col>
                        </Row>}
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <h2>认证机构</h2>
                      {
                        organize_list.map(item=>{
                          return (
                            <div key={item.id} className='item'>
                              <img
                                src={item.logo || DEFAULT_LOGO}
                                className='img'
                                width='100%'
                              />
                              <span className='span'>{item.title}</span>
                            </div>
                          )
                        })
                      }
                    </Paper>
                </div>
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
                        <h2>文章列表</h2>
                        <SectionList lesson_id={id} />
                    </Paper>
                </div>
                <Modal
                    footer = {null}
                    visible = { this.state.oVisible }
                    onCancel = {this.handlerOVisible}
                >
                    <SelectContainer lid={id}/>
                </Modal>
                <SelectUser
                  visible = { this.state.uVisible}
                  onCancel = { this.handlerUVisible }
                  lid = {id}
                />
                <TeamList
                  visible={this.state.tVisible}
                  onCancel = {this.handlerTVisible}
                  list={this.state.team_list.filter(i => i.role !== 1)}
                />
            </div>
        )
    }
}

export default Show
