import React, { Component } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import help from '../services/help' 

const styles = {
    marginTop20: {
        marginTop: 20
    },
    marginLeft10: {
        marginLeft: 10
    }
}

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            title: ''
        }
    }

    componentWillMount() {
        help.get({ id: 10 }).then(data => {
            this.setState({
                content: data.get.content,
                title: data.get.title
            })
        })
    }
    
    render() {
        const push = this.props.push
        return (
        <div>
            <h2>每位教师、医务人员都有自己主讲的医学健康云课程，维护自己的个人品牌！</h2>
            <hr style={ styles.marginTop20 } />
            <div style={{ marginTop: 40 }}>
                <h3 style={{ color: 'red' }}>医卫码头的后台（课程可编辑，可修改状态）</h3>
            </div>
            <div style={ styles.marginTop20 }>
                <span>个人素材:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/resource')}>个人素材</Button>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/question/manage')}>试题库</Button>
            </div>
            <div style={ styles.marginTop20 }>
                <span>个人资源:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/h5/manage')}>图文</Button>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/yunbook/manage')}>云板书</Button>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/textpaper/manage')}>试卷</Button>
            </div>
            <div style={ styles.marginTop20 }>
                <span>课程:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/lesson/list')}>课程管理</Button>
            </div>
            <div style={ styles.marginTop20 }>
                <span>机构:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={() => push('/organize/list')}>机构管理</Button>
            </div>
            <hr style={ styles.marginTop20 } />
            <div style={ styles.marginTop20 }>
                <h3 style={{ color: 'red' }}>医卫码头的前台（课程不可编辑，公开状态）</h3>
            </div>
            <div style={ styles.marginTop20 }>
                <span>我是主讲:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={ 
                    () => window.location.href = 'http://www.yiweimatou.com/i#lessons'
                }
                >我主讲的课程</Button>
            </div>
            <div style={{ margin: '20px 0'}}>
                <span>我是学员:</span>
                <Button type="primary" style={ styles.marginLeft10 } onClick={
                    () => window.location.href = 'http://www.yiweimatou.com/i#follow/lessons'
                }>我加入的课程
                </Button>
            </div>
            <hr />
            <h1 style={{ margin: '40px 0 10px', textAlign: 'center' }}>{this.state.title}</h1>
            <div style={{ margin: 'auto', width: 720, textAlign: 'center' }} dangerouslySetInnerHTML = {{ __html : this.state.content }} />
        </div>
        )
    }
}

export default connect(
    null,
    dispatch => ({
        push: path => dispatch(push(path))
    })
)(Dashboard)
