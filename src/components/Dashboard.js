import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'


const styles = {
    marginTop20: {
        marginTop: 20
    },
    marginLeft10: {
        marginLeft: 10
    }
}
const Dashboard = ({ push })=> (
    <div>
        <h1>每位教师、医务人员都有自己主讲的医学健康云课程，维护自己的个人品牌！</h1>
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
    </div>
)

export default connect(
    null,
    dispatch => ({
        push: path => dispatch(push(path))
    })
)(Dashboard)
