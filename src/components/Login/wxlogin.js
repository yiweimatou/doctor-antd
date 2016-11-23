import React, { Component } from 'react';
import { loadJS } from '../../utils/index'

class WXLogin extends Component {
    componentWillMount() {
        if (window.WxLogin) {
             this.wx = new window.WxLogin({
                id: 'login',
                appid: 'wxe17a9f1153e4a1b5',
                scope: 'snsapi_login',
                redirect_uri: encodeURIComponent('http://www.yiweimatou.com'),
                state: 'doctor'
            })
        } else {
            loadJS('http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js', () => {
                this.wx = new window.WxLogin({
                    id: 'login',
                    appid: 'wxe17a9f1153e4a1b5',
                    scope: 'snsapi_login',
                    redirect_uri: encodeURIComponent('http://www.yiweimatou.com'),
                    state: 'doctor'
                })
            })
        }
    }
    render() {
        return (
            <div id="login" style={{ textAlign: 'center' }} />
        );
    }
}

export default WXLogin
