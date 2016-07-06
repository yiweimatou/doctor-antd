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
                <Menu.Item>
                    <Link to='/organize/list'>
                        <Icon type="team" />机构管理
                    </Link>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="setting" />设置</span>}>
                </SubMenu>
            </Menu>
        )
    }
}

NavMenu.propTypes = {
    selected:PropTypes.string
}

export default NavMenu
