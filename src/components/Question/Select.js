/**
 * Created by zhangruofan on 2016/9/18.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Modal, message, Button } from 'antd'
import { connect } from 'react-redux'

class Select extends Component {
  state = {
    selectedList: [],
    pagination: {
      total: this.props.total,
      showTotal: total => `共 ${total} 条`,
      onChange: offset => this.props.getList({
        limit: 9,
        offset,
        account_id: this.props.userId
      }, error => message.error(error))
    }
  }
  componentWillMount() {
    this.props.getInfo({
      account_id: this.props.userId
    }, error => message.error(error))
    this.props.getList({
      limit: 9,
      offset: 1,
      account_id: this.props.userId
    }, error => message.error(error))
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.total !== nextProps.total){
      this.setState({ pagination: { ...this.state.pagination, total: nextProps.total } })
    }
    if (this.props.selectedIdList != nextProps.selectedIdList) {
      this.setState({ selectedList: nextProps.selectedIdList })
    }
  }
  selectHandler = (e, id, question) => {
    if (e.target.type === 'button') {
      e.target.setAttribute('disabled', 'true')
      e.target.childNodes[0].innerHTML = '已经添加'
    } else {
      e.target.parentNode.setAttribute('disabled', 'true')
      e.target.innerHTML = '已经添加'
    }
    this.setState({
      selectedList: this.state.selectedList.concat({
        id, question
      })
    })
  }
  render() {
    const { list, loading, visible, okHandler, cancelHandler } = this.props
    const columns = [{
      dataIndex: 'question',
      key: 'question',
      title: '试题'
    }, {
      dataIndex: 'option1',
      key: 'option1',
      title: '选项A'
    }, {
      dataIndex: 'option2',
      key: 'option2',
      title: '选项B'
    }, {
      dataIndex: 'option3',
      key: 'option3',
      title: '选项C'
    }, {
      dataIndex: 'option4',
      key: 'option4',
      title: '选项D'
    }, {
      dataIndex: 'option5',
      key: 'option5',
      title: '选项E'
    }, {
      key: 'opreation',
      render: (text, record) => {
        const disabled = this.state.selectedList.some(i => i.id == record.id)
        return <Button disabled={disabled} onClick={e => this.selectHandler(e, record.id, record.question)}>{
          disabled ? '已经添加': '添加'
        }</Button>
      }
    }]
    return (
      <Modal visible={visible} onOk={() => okHandler(this.state.selectedList)} width='100%' onCancel={cancelHandler} title="选择试题">
        <Table bordered columns={columns} dataSource={list} loading={loading} pagination={this.state.pagination} />
      </Modal>
    )
  }
}

Select.propTypes = {
  list: PropTypes.array.isRequired,
  getList: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  visible: PropTypes.bool.isRequired,
  okHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  getInfo: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

export default connect(
  state => ({
    list: state.topic.list,
    loading: state.topic.loading,
    userId: state.auth.key,
    total: state.topic.total
  }),
  dispatch => ({
    getList(params, reject) {
      dispatch({
        type: 'topic/list',
        payload: {
          params,
          reject
        }
      })
    },
    getInfo(params, reject) {
      dispatch({
        type: 'topic/info',
        payload: {
          params,reject
        }
      })
    }
  })
)(Select)