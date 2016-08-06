import React,{Component,PropTypes} from 'react'
import Paper from '../Paper'
import { Row,Col,Button,Modal } from 'antd'
import SelectContainer from '../../containers/organize/selectContainer.js'
import './Show.css'
import SelectUser from '../User/SelectUser.js'
import TeamList from './TeamList.js'
import SectionList from '../Section/List'

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
        if(!lesson){
            return null
        }
        return(
            <div>
                <Paper>
                    <div style={styles.row}>
                        <Row gutter={ 24 }>
                            <Col span={6}>
                                <img alt='pic' width='100%' src={`${lesson.cover}`} />
                            </Col>
                            <Col span={18}>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>课程名称:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{lesson.lname}</span>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>课程简介:</span>
                                    </Col>
                                    <Col span={20}>
                                        <p>{lesson.descript}</p>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>创建时间:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{new Date(lesson.add_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>更新时间:</span>
                                    </Col>
                                    <Col span={20}>
                                        <span>{new Date(lesson.put_ms*1000).toLocaleString()}</span>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>浏览量:</span>
                                    </Col>
                                    <Col span={20}>
                                        <p>{lesson.view_num}</p>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <span>粉丝数:</span>
                                    </Col>
                                    <Col span={20}>
                                        <p>{lesson.focus_num}</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div style={styles.row}>
                        <Row gutter={8}>
                            <Col span={4}>
                                <Button
                                    onClick = {()=>push(`/lesson/edit/${lesson.lid}`)}
                                    type='ghost'
                                >
                                    编辑课程
                                </Button>
                            </Col>
                            <Col span={4}>
                                <Button
                                    type='ghost'
                                    onClick = {
                                        ()=>push(`/section/new/${lesson.lid}`)
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
                            <Col span={4}>
                                <Button
                                    type='ghost'
                                    onClick={this.handlerUVisible}
                                >
                                    邀请成员
                                </Button>
                            </Col>
                            <Col span={4}>
                            {isAdmin===1?
                                <Button
                                    type='ghost'
                                    onClick = {this.handlerTVisible}
                                >
                                    团队管理
                                </Button>:
                                isAdmin===2?
                                <Button
                                    type='ghost'
                                    onClick = {()=>{
                                        teamList.forEach(item=>{
                                            if(item.type===1&&item.uid===uid){
                                                handleRemove(item.id)
                                            }
                                        })
                                    }}
                                >
                                    退出团队
                                </Button>:null
                            }
                            </Col>
                        </Row>
                    </div>
                </Paper>
                <div className='paper'>
                    <Paper>
                        <h2>认证机构</h2>
                            {
                                olist.map(item=>{
                                    return (
                                        <div key={item.oid} className='item'>
                                            <img 
                                                src={item.logo}
                                                className='img'
                                                width='100%'
                                            />
                                            <span className='span'>{item.oname}</span>
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
                                        <div nowrap key={item.uid} className='item'>
                                            {
                                                item.face?
                                                <img 
                                                    src={item.face}
                                                    className='img'
                                                    width='100%'
                                                />:
                                                <div className='divImg'/>
                                            }
                                            {
                                                item.type===3?
                                                <em className='bar'>主讲</em>:''
                                            }
                                            <span className='span'>{item.cname||item.mobile}</span>
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
                            lid={lesson.lid}
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