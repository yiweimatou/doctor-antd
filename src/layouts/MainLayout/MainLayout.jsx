import React, { Component, PropTypes } from 'react';
import './MainLayout.css';
import NavMenu from '../../components/NavMenu.js'
import {Icon} from 'antd'

class MainLayout extends Component{
    state = {
        collapse:false
    }
    collapseChangeHandler(){
        this.setState({
            collapse:!this.state.collapse
        })
    }
    render(){
        const collapse = this.state.collapse
        const { children } = this.props
        return (
            <div className="ant-layout-topaside">
                <div className="ant-layout-header">
                    <div className="ant-layout-wrapper">
                        <div className="ant-layout-logo">
                            <h2>医卫码头管理后台</h2>
                        </div>
                        <div className="ant-layout-login">
                            <h2>请登录</h2>
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

MainLayout.propTypes = {
    children: PropTypes.element.isRequired,
}

export default MainLayout;
