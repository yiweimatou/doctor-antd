import React,{Component,PropTypes} from 'react'
import {Menu,Icon} from 'antd'
import { Link } from 'react-router'

const SubMenu = Menu.SubMenu

class NavMenu extends Component {
    render(){
        return(
            <Menu mode="inline" >
                <Menu.Item>
                    <Link to='/dashboard'><Icon type="laptop" />工作台</Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="user" />导航一</span>}>
                    <Menu.Item key="1"></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="notification" />导航三</span>}>
                </SubMenu>
            </Menu>
        )
    }
}

NavMenu.propTypes = {
    selected:PropTypes.string
}

export default NavMenu
