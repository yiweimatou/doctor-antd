import React, { PropTypes } from 'react'
import { Table,Button } from 'antd'
import { connect } from 'react-redux'

class Message extends React.Component {
  handleOpreation = (flag, foreign_id, type) => {
    switch(type) {
      case 2:
        this.props.lessonPutHandler({
          id: foreign_id,
          cet: flag ? 4 : 3
        })
        break
      case 3:
        this.props.lessonTeamHandler({
          id: foreign_id,
          cet: flag ? 4 : 3
        })
        break
    }
  }
  render () {
    const { message, changeHandler } = this.props
    const columns = [{
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    }, {
      title: '类型',//1系统通知,2课程推荐,3课程团队,4机构申请,5课程报名,6推荐课程报名,7账号提现
      dataIndex: 'type',
      key: 'type',
      render: text => {
        switch (text) {
          case 1:
            return '系统通知'
          case 2:
            return '课程推荐'
          case 3:
            return '课程团队'
          case 4:
            return '机构申请'
          case 5:
            return '课程报名'
          case 6:
            return '推荐课程报名'
          case 7:
            return '账号提现'
        }
      }
    }, {
      title: '通知时间',
      dataIndex: 'add_ms',
      key: 'add_ms',
      render: text => new Date(text*1000).toLocaleString()
    }, {
      title: '状态',
      dataIndex: 'cet',
      key: 'cet',
      render: text => {
        switch (text) {//0未知,1未读,2处理中,3已读拒绝,4已读同意
          case 0:
            return '未知'
          case 1:
            return  '未处理'
          case 2:
            return '处理中'
          case 3:
            return '已读拒绝'
          case 4:
            return '已读同意'
        }
      }
    }, {
      title: '操作',
      key: 'opreation',
      render: (text,record) => (
                record.cet<3 && record.type > 1 && record.type < 4 ?
                <div>
                    <Button 
                        type = 'ghost'
                        onClick={()=>this.handleOpreation(true, record.foreign_id, record.type)}
                    >
                        同意
                    </Button>
                    <span className="ant-divider"></span>
                    <Button 
                        type = 'ghost'
                        onClick={()=>this.handleOpreation(false, record.foreign_id, record.type)}
                    >
                        拒绝
                    </Button>
                </div>:''
            )
    }]
    const pagination = {
      total: message.total,
      pageSize: 6,
      showTotal: total => `共 ${total} 条`,
      onChange(current) {
          changeHandler({...message.params,offset:current})
      }
    }
    return(
      <Table
        dataSource = { message.records }
        columns = { columns }
        pagination = { pagination }
        loading = { message.loading }
      />
    )
  }
}

Message.propTypes = {
  message: PropTypes.object,
  changeHandler: PropTypes.func.isRequired,
  lessonTeamHandler: PropTypes.func.isRequired,
  lessonPutHandler: PropTypes.func.isRequired
}

export default connect(
  state => ({
    message: state.message
  }),
  dispatch => ({
    changeHandler: (params) => dispatch({
      type: 'message/fetchlist',
      payload: params
    }),
    lessonTeamHandler: params => dispatch({
      type: 'lessonTeam/edit',
      payload: params
    }),
    lessonPutHandler: params => dispatch({
      type: 'lesson/put/cet',
      payload: params
    })
  })
)(Message)
