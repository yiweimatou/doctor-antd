import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row,Col,Button,Modal } from 'antd'
import SelectContainer from '../../containers/organize/selectContainer.js'
import './Show.css'
import SelectUser from '../User/SelectUser.js'
import TeamList from './TeamList.js'
import SectionList from '../Section/List'
import { IMG_URL } from '../../constants/api'

const styles = {
    row:{
        padding:30,
        margin:'5px 0'
    }
}
class Show extends Component {
    static propTypes = {
        lesson:PropTypes.object,
        olist:PropTypes.array,
        teamList:PropTypes.array,
        push:PropTypes.func.isRequired,
        changeHandler:PropTypes.func.isRequired,
        sList:PropTypes.object,
        deleteSection:PropTypes.func.isRequired,
        isAdmin:PropTypes.number.isRequired,
        uid:PropTypes.number.isRequired,
        handleRemove:PropTypes.func.isRequired
    }
    state = {
        oVisible:false,
        uVisible:false,
        tVisible:false,
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
    render(){
        const {
            lesson,
            olist,teamList,push,changeHandler,
            sList,deleteSection,isAdmin,uid,handleRemove
        } = this.props
        return(
            <div>
                <Paper>
                    <div style={styles.row}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <img alt='pic' width='100%' src={lesson&&`${IMG_URL}${lesson.cover}`} />
                            </Col>
                            <Col span={6}>
                                <span>课程名称:</span>
                            </Col>
                            <Col span={6}>
                                <span>{lesson&&lesson.title}</span>
                            </Col>
                            <Col span={6}>
                                <span>课程简介:</span>
                            </Col>
                            <Col span={6}>
                                <p>{lesson&&lesson.descript}</p>
                            </Col>
                            <Col span={6}>
                                <span>创建时间:</span>
                            </Col>
                            <Col span={6}>
                                <span>{lesson&&new Date(lesson.add_ms*1000).toLocaleString()}</span>
                            </Col>
                            <Col span={6}>
                                <span>更新时间:</span>
                            </Col>
                            <Col span={6}>
                                <span>{lesson&&new Date(lesson.put_ms*1000).toLocaleString()}</span>
                            </Col>
                            <Col span={3}>
                                <span>浏览量:</span>
                            </Col>
                            <Col span={3}>
                                <p>{lesson&&lesson.pv}</p>
                            </Col>
                            <Col span={3}>
                                <span>粉丝数:</span>
                            </Col>
                            <Col span={3}>
                                <p>{lesson&&lesson.uv}</p>
                            </Col>      
                            <Col span = {2}>
                                <span>课程价格:</span>
                            </Col>
                            <Col span = {2}>
                                <span className='money'>{lesson&&lesson.account_money}</span>元                              
                            </Col>
                        </Row>
                    </div>
                    {isAdmin===3?null:
                    <div style = { styles.row } >
                        <Row>
                            <Col span={20}>
                                <Row>
                                  <Col span={2}>
                                    课程余额
                                  </Col>
                                  <Col span={2}>
                                    <span className='money'><em>{lesson&&lesson.amount_money}</em></span>元
                                  </Col>
                                  <Col offset={2} span={18}>
                                    <span>每天23:00课程账户进行分成,分成总额将扣除当天信用账户支出费用
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                    <Col span={2}>
                                        信用账户
                                    </Col>
                                    <Col span={2}>
                                        <span className='money'><em>{lesson&&lesson.credit_money}</em></span>元
                                    </Col>
                                    <Col offset={2} span={18}>
                                        <span>
                                            课程可供消费总额为200元
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={4}>
                                <Button
                                    onClick = {()=>push()}
                                    type = 'ghost'
                                >
                                    交易明细
                                </Button>
                            </Col>
                        </Row>
                    </div>}
                    <div style={styles.row}>
                        {isAdmin === 3?null:                    
                        <Row>
                            <Col span={4}>
                                <Button
                                    onClick = {()=>lesson&&push(`/lesson/edit/${lesson.id}`)}
                                    type='ghost'
                                >
                                    编辑课程
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button
                                    type='ghost'
                                    onClick = {
                                        ()=>lesson&&push(`/section/new/${lesson.id}`)
                                    }
                                >
                                    新建文章
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button
                                    onClick={this.handlerOVisible}
                                    type='ghost'
                                >
                                    申请机构认证
                                </Button>
                            </Col>
                            {isAdmin ===1 ?
                            <Col span={4}>
                                <Button
                                    type='ghost'
                                    onClick={this.handlerUVisible}
                                >
                                    邀请成员
                                </Button>
                            </Col>:null}
                            <Col span={4}>
                            {isAdmin===1?
                                <Button
                                    type='ghost'
                                    onClick = {this.handlerTVisible}
                                >
                                    团队管理
                                </Button>:
                                <Button
                                    type='ghost'
                                    onClick = {()=>{
                                        teamList.forEach(item=>{
                                            if(item.type===1&&item.account_id===uid){
                                                handleRemove(item.id)
                                            }
                                        })
                                    }}
                                >
                                    退出团队
                                </Button>
                            }
                            </Col>
                        </Row>}
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <h2>认证机构</h2>
                            {
                                olist.map(item=>{
                                    return (
                                        <div key={item.id} className='item'>
                                            <img 
                                                src={`${IMG_URL}${item.organize_logo}`}
                                                className='img'
                                                width='100%'
                                            />
                                            <span className='span'>{item&&item.organize_name}</span>
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
                            teamList.map(item=>{
                                return(
                                        <div nowrap key={item.id} className='item'>
                                            {
                                                item.user&&item.user.face?
                                                <img 
                                                    src={IMG_URL+item.user.face}
                                                    className='img'
                                                    width='100%'
                                                />:
                                                <div className='divImg'/>
                                            }
                                            {
                                                item.type===3?
                                                <em className='bar'>主讲</em>:''
                                            }
                                            <span className='span'>{item.user&&(item.user.cname || item.user.mobile) }</span>
                                        </div>
                                )
                            })
                        }
                    </Paper>
                </div>
                <div className='paper'>
                    <Paper>
                        <h2>文章列表</h2>
                        <SectionList
                            lid={lesson&&lesson.id}
                            push={push}
                            changeHandler={changeHandler}
                            list={sList.data}
                            pageParams={sList.pageParams}
                            deleteSection={deleteSection}
                        />
                    </Paper>
                </div>
                <Modal
                    footer = {null}
                    visible = { this.state.oVisible }
                    onCancel = {this.handlerOVisible}
                >
                    <SelectContainer />
                </Modal>
                <SelectUser
                    visible={ this.state.uVisible}
                    onCancel={ this.handlerUVisible } 
                />
                <TeamList 
                    visible={this.state.tVisible}
                    onCancel = {this.handlerTVisible}
                />
            </div>
        )
    }
}

export default Show