/**
 * Created by zhangruofan on 2016/9/20.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { message, Row, Col } from 'antd'

const styles = {
  a: {
    display: 'inline-block',
    width: 150,
    height: 120,
    // hover: backgroundColor
    border: '2px solid #57c5f7',
    textAlign: 'center',
    lineHeight: '120px'
  },
  row: {
    padding: 30,
  }
}

class Choose extends Component {
  componentWillMount() {
    if (!this.props.query.oid && !this.props.query.lid) {
      message.error('非法请求，请输入正确的网址', 8)
      this.props.redirect('/')
    }
  }
  shouldComponentUpdate() {
    return false
  }
  render() {
    const { oid, lid } = this.props.query
    let query = ''
    if(oid && lid){
      query = `oid=${oid}&lid=${lid}`
    } else {
      return (<div>非法请求</div>)
    }
    return (
      <div>
        <p style={{textAlign: 'center'}}>新建文章-选择文章类型</p>
        <Row style={styles.row}>
          <Col span={8}>
            <a style={styles.a} href={`/section/add/book?${query}`}>创建云板书</a>
          </Col>
          <Col span={8}>
            <a style={styles.a} href={`/section/add/textpaper?${query}`}>创建试卷</a>
          </Col>
          <Col span={8}>
            <a style={styles.a} href={`/section/add/notice?${query}`}>创建通知</a>
          </Col>
        </Row>
        <Row style={styles.row}>
          <Col span={8}>
            <a style={styles.a} href={`/section/add/active?${query}`}>创建活动</a>
          </Col>
          <Col span={8}>
            <a style={styles.a} href={`/section/add/html?${query}`}>创建图文</a>
          </Col>
        </Row>
      </div>
    )
  }
}

Choose.propTypes = {
  query: React.PropTypes.object.isRequired
}

export default connect(
  state => ({
    query: state.routing.locationBeforeTransitions.query
  }),
  dispatch => ({
    redirect: path => dispatch(push(path))
  })
)(Choose)
