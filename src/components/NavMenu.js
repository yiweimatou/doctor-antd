import React,{Component,PropTypes} from 'react'
import {Menu,Icon} from 'antd'
import { Link } from 'react-router'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

class NavMenu extends Component {
    render(){
        const {
            lessons
        } = this.props
        if(!lessons){
            return (null)
        }
        return(
            <Menu mode="inline" >
                <Menu.Item>
                    <Link to='/dashboard'><Icon type="laptop" />工作台</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to='/organize/list'>
                        <Icon type="team" />机构管理
                    </Link>
                </Menu.Item>
                <SubMenu
                    key="sub2"
                    title={
                        <span><Icon type="exception" />课程管理</span>
                    }
                >
                    <Menu.Item>
                        <Link to='/lesson/new'>
                            新建课程
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/lesson/list'>
                            我的主讲课程
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/lesson/tlist'>
                            我的团队课程
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/lesson/recommend'>
                            推荐课程
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="sub3"
                    title={
                        <span><Icon type="book" />云板书管理</span>
                    }
                >
                    <Menu.Item>
                        <Link to='/yunbook/new'>
                            新建云板书
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to='/yunbook/list'>
                            我的云板书
                        </Link>
                    </Menu.Item>
                </SubMenu>
                <Item>
                    <Link to='/message/index'>
                        <Icon type="notification" />消息管理
                    </Link>
                </Item>
                <SubMenu key="sub1" title={<span><Icon type="setting" />设置</span>}>
                    <Item>
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
    selected:PropTypes.string,
    lessons:PropTypes.number
}

export default NavMenu
