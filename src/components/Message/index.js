import React, { PropTypes } from 'react'
import { Table } from 'antd'
import { connect } from 'react-redux'
import { keyToName } from '../../utils'
import Help from '../help'

class Message extends React.Component {
  render () {
    const { message, changeHandler } = this.props
    const columns = [{
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    }, {
      title: '类型',
      dataIndex: 'category_id',
      key: 'category_id',
      render: text => {
        return keyToName(text)
      }
    }, {
      title: '通知时间',
      dataIndex: 'add_ms',
      key: 'add_ms',
      render: text => new Date(text*1000).toLocaleString()
    }]
    const pagination = {
      pageSize: 9,
      showTotal: total => `共 ${total} 条`,
      onChange(offset) {
        changeHandler({ offset, limit: 9 })
      }
    }
    return(
      <div>
        <Help help_id={22} style={{ margin: '10px 0' }}/>
        <Table
          rowKey="id"
          dataSource = { message.records }
          columns = { columns }
          pagination = { {...pagination, total: message.total } }
          loading = { message.loading }
        />
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object,
  changeHandler: PropTypes.func.isRequired
}

export default connect(
  state => ({
    message: state.message
  }),
  dispatch => ({
    changeHandler: (params) => dispatch({
      type: 'message/fetchlist',
      payload: params
    })
  })
)(Message)
