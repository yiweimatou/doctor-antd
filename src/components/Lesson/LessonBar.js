import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router'
import Paper from '../Paper'
import { Menu } from 'antd'
import { DEFAULT_COVER } from '../../constants/api'

class LessonBar extends Component {
    render() {
        const { current, lesson } = this.props
        return (
            <Paper>
                <div style={{padding: 30}}>
                    <div style={{ display: 'inline-block', float: 'left'}}>
                        <img src={ lesson && (lesson.cover || DEFAULT_COVER)} width={105} height={40} />
                    </div>
                    <div style={{ display: 'inline-block', float: 'left', height: '40px', overFlow: 'hidden', width: 200 }}>
                        {lesson && (lesson.title || '')}
                    </div>
                    <div style={{display: 'inline-block', marginLeft: 30}}>
                        <Menu
                            selectedKeys={[current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="draft">
                                <Link to={`/section/draft/?oid=0&lid=${lesson && lesson.id}`}>资源库</Link>
                            </Menu.Item>
                             <Menu.Item key="section">
                                <Link to={`/lesson/section/?id=${lesson && lesson.id}`}>资讯列表</Link>
                            </Menu.Item>
                            <Menu.Item key="detail">
                                <Link to={`/lesson/show/${lesson && lesson.id}`}>课程详情</Link>
                            </Menu.Item>
                            <Menu.Item key="team">
                                <Link to={`/lesson/team/?id=${lesson && lesson.id}`}>教师团队</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to={`/lesson/show/${lesson && lesson.id}`}>学员</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to={`/lesson/show/${lesson && lesson.id}`}>统计</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>                
            </Paper>
        );
    }
}

LessonBar.propTypes = {
    lesson: PropTypes.object,
    current: PropTypes.string
};

export default LessonBar;