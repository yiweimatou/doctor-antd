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
                <SubMenu key = 'sub5' title = { <span><Icon type="calculator" />试卷管理</span> } disabled = {user && user.lesson === 1}>
                    <Item key = '11'>
                        <Link to = '/question/add'>新增试题</Link>
                    </Item>
                    <Item key = '13'>
                        <Link to = '/question/list'>我的题库</Link>
                    </Item>
                    <Item key="12">
                      <Link to="/textpaper/add">新增试卷</Link>
                    </Item>
                    <Item key="14">
                      <Link to="/textpaper/list">我的试卷</Link>
                    </Item>
                </SubMenu>
                <SubMenu
                    key="sub3"
                    title={
                        <span><Icon type="book" />云板书管理</span>
                    }
                    disabled = {user && user.lesson===1}
                >
                    <Item key='4'>
                        <Link to='/yunbook/new'>
                            新建云板书
                        </Link>
                    </Item>
                    <Item key='3'>
                        <Link to='/yunbook/list'>
                            我的云板书
                        </Link>
                    </Item>
                </SubMenu>
                <Item key='2'>
                    <Link to='/message/index'>
                        <Icon type="notification" />消息管理
                    </Link>
                </Item>
                <SubMenu key="sub1" title={<span><Icon type="setting" />设置</span>}>
                    <Item key='1'>
                        <Link to='/user/money'>
                            个人账户
                        </Link>
                    </Item>
                </SubMenu>
            </Menu>
        )
    }
}

NavMenu.propTypes = {
    user:PropTypes.object
}

export default NavMenu
