import React,{Component,PropTypes} from 'react'
import {Menu,Icon} from 'antd'
import { Link } from 'react-router'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

class NavMenu extends Component {
    render(){
        const { user } = this.props
        return(
            <Menu mode="inline" >
                <Item key='10'>
                    <Link to='/dashboard'><Icon type="laptop" />工作台</Link>
                </Item>
                <Item key='9'>
                    <Link to='/organize/list'>
                        <Icon type="team" />机构管理
                    </Link>
                </Item>
                <SubMenu
                    key="sub2"
                    title={
                        <span><Icon type="exception" />课程管理</span>
                    }
                >
                    <Item key='7' disabled = {user && user.lesson===1}>
                        <Link to='/lesson/list'>
                            我的主讲课程
                        </Link>
                    </Item>
                    <Item key='6'>
                        <Link to='/lesson/tlist'>
                            我的团队课程
                        </Link>
                    </Item>
                </SubMenu>
                <SubMenu key = 'sub5' title = { <span><Icon type="book" />资源管理</span> }>
                    <Item key="book">
                        <Link to='/yunbook/manage'>云板书管理</Link>
                    </Item>
                    <Item key = '13'>
                        <Link to = '/question/manage'>题库管理</Link>
                    </Item>
                    <Item key="14">
                      <Link to="/textpaper/manage">试卷管理</Link>
                    </Item>
                    <Item key="h5">
                        <Link to="/h5/manage">图文管理</Link>
                    </Item>
                </SubMenu>
                <SubMenu key = 'task' title = { <span><Icon type="cloud-o" />任务管理</span> }>
                    <Item key="market">
                        <Link to='/task/list'>任务市场</Link>
                    </Item>
                    <Item key="myTask">
                        <Link to='/task/mine'>我的任务</Link>
                    </Item>
                </SubMenu>
                <Item key='15'>
                    <Link to='/resource'><Icon type="folder" />个人素材库</Link>
                </Item>
                <Item key='2'>
                    <Link to='/message/index'>
                        <Icon type="notification" />消息管理
                    </Link>
                </Item>
                <SubMenu key="sub1" title={<span><Icon type="setting" />设置</span>}>
                    <Item key='1'>
                        <Link to='/user/bill'>
                            个人账户
                        </Link>
                    </Item>
                </SubMenu>
                <Item key="schedule">
                    <Link to='/schedule'>
                        <Icon type="calendar" />排班表管理
                    </Link>
                </Item>
            </Menu>
        )
    }
}

NavMenu.propTypes = {
    user:PropTypes.object
}

export default NavMenu
