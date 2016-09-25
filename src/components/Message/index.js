import React, { PropTypes } from 'react'
import { Table,Button } from 'antd'
import { connect } from 'react-redux'
import { keyToName } from '../../utils'

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
    }, {
      title: '操作',
      key: 'opreation',
      render: (text,record) => (
                record.cet<3 && record.type > 1 && record.type < 4 ?
                <div>
                    <Button 
                        type = 'ghost'
                        onClick={()=>{}}
                    >
                        同意
                    </Button>
                    <span className="ant-divider"></span>
                    <Button 
                        type = 'ghost'
                        onClick={()=>{}}
                    >
                        拒绝
                    </Button>
                </div>:''
            )
    }]
    const pagination = {
      pageSize: 9,
      showTotal: total => `共 ${total} 条`,
      onChange(offset) {
      }
    }
    return(
      <Table
        dataSource = { message.records }
        columns = { columns }
        pagination = { {...pagination, total: message.total } }
        loading = { message.loading }
      />
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
