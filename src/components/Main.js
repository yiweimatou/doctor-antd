import React, { Component, PropTypes } from 'react'
import './Main.css'
import NavMenu from './NavMenu'
import { Button } from 'antd'

class Main extends Component{
    render(){
        const { auth, children, logout, routes, params } = this.props
        const year = (new Date()).getFullYear()
        return (
            <div className="ant-layout-topaside">
                <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-logo">
                            <h2>医卫码头管理后台</h2>
                        </div>
                        <div className="ant-layout-login">
                            <Button
                                icon = 'logout'
                                type = 'ghost'
                                onClick = { logout }
                            >
                                {   auth && auth.user ?
                                    auth.user.nickname||auth.user.cname||auth.user.mobile
                                    :''
                                }
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <aside className="ant-layout-sider">
                            <NavMenu user={auth&&auth.user}/>
                        </aside>
                        <main className="ant-layout-content">
                            <div style={{clear: 'both'}}>{children}</div>
                        </main>
                    </div>
                    <div className="ant-layout-footer">
                        版权所有 © {year} 由医卫里技术部支持
                    </div>
                </div>
            </div>
        )
    }
}

Main.propTypes = {
    children: PropTypes.element,
    auth:PropTypes.object.isRequired,
    login:PropTypes.func.isRequired,
    logout:PropTypes.func.isRequired
}

export default Main
