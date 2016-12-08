import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux'
import { message, Spin, Pagination, Button } from 'antd'
import LessonBar from './LessonBar'
import { DEFAULT_FACE } from '../../constants/api'
import Paper from '../Paper'
import SelectUser from '../User/SelectUser.js'

class Team extends Component {
    state = {
        list: [],
        total: 0,
        loading: true,
        user: {},
        visible: false
    }
    visibleHandler = () => this.setState({ visible: false })
    componentWillMount() {
        const { getList, query, userId } = this.props
        getList({
            lesson_id: query.id 
        }, list => this.setState({
            list: list.sort((i,j) => i.state > j.state), loading: false, total: list.length, user: list.find(i => i.id.toString() === userId)
        }), error => message.error(error))
    }
    render() {
        const { query, handleRemove } = this.props
        const { list, total, loading, user, visible } = this.state
        return (
            <div>
                <SelectUser
                  visible = { visible }
                  onCancel = { this.visibleHandler }
                  lid = {query.id}
                />
                <LessonBar lid={query.id} current='team' />
                <Spin spinning={loading}>
                    <Paper>
                    <div style={{ margin: 30, padding: '30px 0'}}>
                        <div style={{float: 'right'}}>
                            { user.role === 1 ?
                                <Button type='primary' onClick={() => this.setState({ visible: true })}>邀请团队成员</Button> :
                              user.role === 2 ? null:
                                <Button type='ghost' onClick={() => handleRemove({
                                    id: user.tid
                                }, () => {
                                    message.success('成功退出团队!', 6)
                                    this.setState({ list: list.filter(i => i.id !== user.id)})
                                }, error => message.error(error, 6))}>退出团队</Button>
                            }
                        </div>
                    {list.map(item => (
                        <div key={item.id} style={{ marginTop: 40, height: '100px', border: 'solid #ddd', borderWidth: '2px 0 2px 0'}}>
                            <img src = { item.cover || DEFAULT_FACE } width='100%' style={{ marginTop: 10, width: 80, heigth: 80, borderRadius: '50%',float: 'left'}} />
                            <div style={{float: 'left', margin: 10}}>
                                <p>{item.cname || item.mobile}</p>
                                <p>{ item.role === 1 ? '主讲': item.role === 2 ? '辅导员': '助教' }</p>
                            </div>
                            <div style={{float: 'right', marginTop: 40}}>
                                { user.role === 1 && item.role === 3 ? <Button type='ghost' onClick={() => handleRemove({
                                    id: item.tid
                                }, () => {
                                    message.success(`${item.cname || item.mobile} 已经被移除`, 6)
                                    this.setState({ list: list.filter(i => i.id !== item.id)})
                                })}>移除</Button>: null}
                            </div>
                        </div>
                    ))}
                        <div style={{marginBottom: 30}}>
                            { total > 0 ?
                                <div style={{margin: '20px 0', float: 'right', height: '100%'}}>
                                    <Pagination total={total} showTotal = { total => `共${total}条`} pageSize={6}/>
                                </div>:
                                <div style={{textAlign: 'center'}}>暂无数据</div>
                            }
                        </div>
                        </div>
                    </Paper>
                </Spin>
            </div>
        );
    }
}

Team.propTypes = {
    query: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // userId: PropTypes.number.isRequired
};

export default connect(
    state => ({
        query: state.routing.locationBeforeTransitions.query,
        userId: state.auth.key
    }),
    dispatch => ({
        handleRemove: (params, resolve, reject) => {
            dispatch({
                type: 'lesson_team/delete',
                payload: {
                  params, resolve, reject
                }
            })
        },
        getList: (params, resolve, reject) => {
            dispatch({
                type: 'lessonteam/list',
                payload: {
                    params, resolve, reject
                }
            })
        }
    })
)(Team);