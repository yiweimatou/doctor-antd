import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Button, Modal, message } from 'antd'
import SelectContainer from '../../containers/organize/selectContainer.js'
import './Show.css'
import { DEFAULT_COVER, DEFAULT_LOGO } from '../../constants/api'
import LessonBar from './LessonBar'
import ChooseBar from '../Section/ChooseBar'

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
        // userId: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        getLessonTeamList: PropTypes.func.isRequired,
        getOrganizeList: PropTypes.func.isRequired,
        getLessonTeam: PropTypes.func.isRequired,
        getLesson: PropTypes.func.isRequired
    }
    state = {
        organize_list: [],
        team_list: [],
        organize_select_visible: false,
        pending: true
    }
    componentWillMount() {
      this.props.getLesson({
        id: this.props.id
      })
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
    handlerOrganizeVisible = () => this.setState({ organize_select_visible: false })
    render(){
        const {
          push, id, lesson
        } = this.props
        const { organize_list, team_list } = this.state
        const master = team_list.find(i => i.role === 1)
        const money = lesson && lesson.account_amount ? lesson.account_amount/100 : 0
        const time = lesson && lesson.add_ms ? new Date(lesson.add_ms*1000).toLocaleString(): ''
        const balance_amount = lesson && lesson.balance_amount ? lesson.account_amount/100 : 0
        const credit_amount = lesson && lesson.credit_amount ? lesson.credit_amount/100 : 0
        return(
            <div>
                <LessonBar lid={id} current='detail' />
                <Paper>
                    <div style={styles.row}>
                        <div className='cover'>
                            <img alt='pic' width='534' height='200' src={ lesson && lesson.cover|| DEFAULT_COVER} />
                        </div>
                        <div className='detail'>
                            <div><h2>{lesson && lesson.title}</h2></div>
                            <div>主讲 <em>{master && (master.cname || master.mobile) }</em> &nbsp;&nbsp;
                                |&nbsp;&nbsp; 浏览量 <em>{lesson && lesson.pv}</em> &nbsp;&nbsp;|&nbsp;&nbsp; 粉丝数 <em>{lesson && lesson.uv}</em></div>
                            <div>创建时间&nbsp;&nbsp;{time}</div>
                            <div>课程金额
                                <span className='money'>{money}</span>元
                            </div>
                            <div>
                                <ChooseBar lid={id} oid="0"/>
                                <Button onClick = {() => push(`/task/add/${id}`)} className='marginLeft' type='ghost' size='large'>发布图文任务</Button>
                                <Button onClick = {() => push(`/lesson/edit/${id}`)} className='marginLeft' type='ghost' size='large'>编辑课程</Button>
                                <Button onClick = {() => push(`/lesson/bill?id=${id}`)} className='marginLeft' type='ghost' size='large'>交易明细</Button>
                            </div>
                        </div>
                    </div>
                    <hr style={{margin: '0 30px'}} color='#ddd'/>
                    <div style = { styles.row } >
                        <div className='halfLeft'>
                            <p>课程余额</p>
                            <span style={{color: '#40b0de', fontSize: '200%'}}>{balance_amount}</span>&nbsp;&nbsp;元
                            <p>每月一日0点自动分成，课程余额超过1000元部分分成</p>
                        </div>
                        <div className='halfRight'>
                            <p>信用账户</p>
                            <span style={{color: '#22cb33', fontSize: '200%'}}>{credit_amount}</span>&nbsp;&nbsp;元
                            <p>信用账户总额为1000元，课程收入优先还入信用账户</p>
                        </div>
                    </div>
                </Paper>
                <Paper>
                    <div style={styles.row}>
                        <div style={{display: 'inline-block', width: '100%'}}>
                            <h2 style={{marginLeft: 30, float: 'left'}}>认证机构</h2>
                            <Button disabled={!lesson || (lesson && lesson.state === 2)} style={{marginRight: 30, float: 'right'}} onClick={() => this.setState({ organize_select_visible: true })} type='ghost'>申请机构认证</Button>
                        </div>
                        <hr style={{margin: '0 30px'}} color='#ddd'/>
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
                    </div>
                </Paper>
                <Modal
                    footer = {null}
                    visible = { this.state.organize_select_visible }
                    onCancel = {this.handlerOrganizeVisible}
                >
                    <SelectContainer lid={id}/>
                </Modal>
            </div>
        )
    }
}

export default Show
