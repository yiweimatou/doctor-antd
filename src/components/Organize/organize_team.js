import React, { Component } from 'react'
import OrganizeBar from './organize_bar'
import { connect } from 'react-redux'
import { Table, Button, message } from 'antd'
import { asyncList, remove, add } from '../../services/organizeTeam'
import UserSelector from '../User/selector'
import { DEFAULT_FACE } from '../../constants/api'

class OrganizeTeam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [],
            loading: true,
            visible: false,
            isAdmin: false
        }
    }
    
    componentWillMount() {
        asyncList({ state: 1, organize_id: this.props.params.id }, (error, dataSource) => {
            if (error) {
                this.setState({
                    loading: false
                })
                message.error(error)
            } else {
                if (dataSource.some(i => i.role === 1 && i.account_id.toString() === this.props.userId)) {
                    this.setState({ isAdmin: true })
                }
                this.setState({
                    loading: false,
                    dataSource
                })
            }
        })   
    }

    clickHandler = id => {
        remove({ id }).then(() => {
            message.success('移除成功')
            this.setState({
                dataSource: this.state.dataSource.filter(i => i.id !== id)
            })
        }).catch((error) => message.error(`移除失败:${error}`))
    }

    selectHandler = user => {
        add({
            organize_id: this.props.params.id,
            account_id: user.id
        }).then(data => {
            this.setState({
                dataSource: this.state.dataSource.concat({
                    id: data.identity,
                    mobile: user.mobile,
                    user: `${user.cet_cname}/${user.cname}`,
                    role: 2,
                    logo: user.logo || DEFAULT_FACE
                }),
                visible: false
            })
            message.success('添加成功!')
        }).catch(error => message.error(`添加失败: ${error}`))
    }
    
    render() {
        const { organize } = this.props
        const { loading, dataSource, visible, isAdmin } = this.state 
        const columns = [{
            title: '头像',
            key: 'logo',
            dataIndex: 'logo',
            render: text => <img src={text} width="50px" height="50px" />
        }, {
            title: '姓名',
            key: 'user',
            dataIndex: 'user'
        }, {
            title: '手机号码',
            key: 'mobile',
            dataIndex: 'mobile'
        }, {
            title: '角色',
            key: 'role',
            dataIndex: 'role',
            render: text => text === 1 ? '超级管理员': '普通管理员'
        }, {
            title: '操作',
            key: 'opreate',
            render: (text, record) => record.role === 1 ? null : 
                isAdmin ? <Button onClick={() => this.clickHandler(record.id)}>移除</Button> : null
        }]
        return (
            <div>
                <OrganizeBar selectedKey="team" organize={organize} />
                { isAdmin ?
                <div style={{ margin: '20px auto'}}>
                    <Button type="primary" onClick={() => this.setState({ visible: true })}>添加普通管理员</Button>
                    <UserSelector visible={visible} selectHandler={this.selectHandler} cancelHandler={() => this.setState({ visible: false })}/>
                </div>
                : null }
                <Table columns={columns} dataSource={dataSource} loading={loading} />
            </div>
        )
    }
}

export default connect(
    state => ({
        organize: state.organize.entity,
        userId: state.auth.key
    })
)(OrganizeTeam)