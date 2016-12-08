import React, {Component, PropTypes} from 'react';
import { Menu, Dropdown, Icon, Button } from 'antd'


class ChooseBar extends Component {
    render() {
        const { lid, oid } = this.props        
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <a href={`/section/add/book?lid=${lid}&oid=${oid}`}>引用云板书</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href={`/section/add/topics?lid=${lid}&oid=${oid}`}>引用试卷</a>
                </Menu.Item>
                <Menu.Item key="5">
                    <a href={`/section/add/h5?lid=${lid}&oid=${oid}`}>引用图文</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href={`/section/add/notice?lid=${lid}&oid=${oid}`}>创建通知</a>
                </Menu.Item>
                <Menu.Item key="3">
                    <a href={`/section/add/active?lid=${lid}&oid=${oid}`}>创建活动</a>
                </Menu.Item>
                <Menu.Item key="4">
                    <a href={`/section/add/html?lid=${lid}&oid=${oid}`}>创建图文</a>
                </Menu.Item>
            </Menu>
        )
        return (
                <Dropdown overlay={menu}>
                    <Button type="primary" style={{ marginLeft: 8 }}>
                            创建资源 <Icon type="down" />
                    </Button>
                </Dropdown>
        );
    }
}

ChooseBar.propTypes = {
    lid: PropTypes.string.isRequired,
    oid: PropTypes.string.isRequired,
};

export default ChooseBar;