import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router'
import Paper from '../Paper'
import { Menu } from 'antd'
<<<<<<< Updated upstream
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
=======
import { connect } from 'react-redux'
import { DEFAULT_COVER } from '../../constants/api'

class LessonBar extends Component {
    componentWillMount() {
      const { lid, getLesson } = this.props
      getLesson({ id: lid })
    }
    render() {
        const { current, lesson, lid } = this.props
        return (
            <Paper>
                <div style={{padding: 10, margin: 10}}>
                    <div style={{ display: 'inline-block', float: 'left'}}>
                        <img src={ lesson && lesson.cover || DEFAULT_COVER } width={105} height={40} />
                    </div>
                    <div style={{ display: 'inline-block', float: 'left', height: '40px', overFlow: 'hidden', width: 200 }}>
                        { lesson && lesson.title || '' }
>>>>>>> Stashed changes
                    </div>
                    <div style={{display: 'inline-block', marginLeft: 30}}>
                        <Menu
                            selectedKeys={[current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="draft">
<<<<<<< Updated upstream
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
=======
                                <Link to={`/section/draft/?oid=0&lid=${lid}`}>资源库</Link>
                            </Menu.Item>
                             <Menu.Item key="section">
                                <Link to={`/lesson/section/?id=${lid}`}>资讯列表</Link>
                            </Menu.Item>
                            <Menu.Item key="detail">
                                <Link to={`/lesson/show/${lid}`}>课程详情</Link>
                            </Menu.Item>
                            <Menu.Item key="team">
                                <Link to={`/lesson/team/?id=${lid}`}>教师团队</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to={`/lesson/show/${lid}`}>学员</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to={`/lesson/show/${lid}`}>统计</Link>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
>>>>>>> Stashed changes
            </Paper>
        );
    }
}

LessonBar.propTypes = {
<<<<<<< Updated upstream
    lesson: PropTypes.object,
    current: PropTypes.string
};

export default LessonBar;
=======
    lid: PropTypes.string.isRequired,
    current: PropTypes.string.isRequired,
    getLesson: PropTypes.func.isRequired,
    lesson: PropTypes.object
};

export default connect(
  state => ({
    lesson: state.lesson.entity
  }),
  dispatch => ({
    getLesson: (params) => {
      dispatch({
        type: 'lesson/get',
        payload: params
      })
    }
  })
)(LessonBar);
>>>>>>> Stashed changes
