import React, {Component, PropTypes} from 'react';
import { Menu, Dropdown, Icon, Button } from 'antd'


class ChooseBar extends Component {
    render() {
        const { lid } = this.props        
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href={`/section/add/book?lid=${lid}&oid=0`}>引用云板书</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href={`/section/add/topics?lid=${lid}&oid=0`}>引用试卷</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href={`/section/add/notice?lid=${lid}&oid=0`}>创建通知</a>
                </Menu.Item>
                <Menu.Item key="3">
                    <a href={`/section/add/active?lid=${lid}&oid=0`}>创建活动</a>
                </Menu.Item>
                <Menu.Item key="4">
                    <a href={`/section/add/html?lid=${lid}&oid=0`}>创建图文</a>
                </Menu.Item>
            </Menu>
        )
        return (
                <Dropdown overlay={menu}>
                    <Button type="primary" style={{ marginLeft: 8 }}>
                            创建课程资源 <Icon type="down" />
                    </Button>
                </Dropdown>
        );
    }
}

ChooseBar.propTypes = {
    lid: PropTypes.string.isRequired
};

export default ChooseBar;