import React, { Component, PropTypes } from 'react';
import './Main.css';
import NavMenu from './NavMenu'
import Login from '../components/Login'

class Main extends Component{
    render(){
        const { auth,children,login } = this.props
        return (
            <div className="ant-layout-topaside">
                <Login 
                    isAuthed = {auth.isAuthed} 
                    loading = {auth.loading}
                    login={login}
                />
                <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-logo">
                            <h2>医卫码头管理后台</h2>
                        </div>
                        <div className="ant-layout-login">
                            <h2>{auth.user?
                                    auth.user.nickname||auth.user.cname||auth.user.mobile
                                    :''
                                }</h2>
                        </div>
                    </div>
                </div>
                <div className="ant-layout-wrapper">
                    <div className="ant-layout-container">
                        <aside className="ant-layout-sider">
                            <NavMenu />
                        </aside>
                        <div className="ant-layout-content">
                            <div style={{ height: 240 }}>
                                <div style={{clear: 'both'}}>{children}</div>
                            </div>
                        </div>
                    </div>
                    <div className="ant-layout-footer">
                        版权所有 © 2016 由医卫里技术部支持
                    </div>
                </div>
            </div>
        )
    }
}

Main.propTypes = {
    children: PropTypes.element,
    auth:PropTypes.object.isRequired,
    login:PropTypes.func.isRequired
}

export default Main
