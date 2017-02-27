/**
 * Created by zhangruofan on 2016/9/18.
 */
import React, { Component, PropTypes } from 'react'
import { Table, Modal, message } from 'antd'
import {TOPIC} from '../../constants/api'
import Category from '../Category'
import { connect } from 'react-redux'

class Select extends Component {
  state = {
    selectedList: [],
    area: {},
    value: []
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
      this.setState({ total: nextProps.total })
    }
    if (this.props.selectedIdList != nextProps.selectedIdList) {
      this.setState({ selectedList: nextProps.selectedIdList })
    }
  }
  _changeHandler = (value, latLng, area) => {
      Promise.resolve(this.setState({value, area})).then(() => {
        this._search(1)
      })
  }
  _search = offset => {
     const {search, getList, searchInfo, userId, clear} = this.props
     const {value, area} = this.state
     if (value.length === 0) {
       getList({
         offset, limit: 8, account_id: userId, state: 1
       }, error => message.error(error))
       return
     }
      let params = {
        account_id: userId,
        category_id: TOPIC,
        state: 1,
        map_id: 1
      }
      if ((value.length <= 3 && value[0].startsWith('2')) || (value.length <= 2 && value[0].startsWith('1')) ) {
        params = {
          ...params,
          kind: value.slice(-1)[0]
        }
      } else {
        params = {
          ...params,
          ...area
        }
      }
      searchInfo(params, total => this.setState({total}), error => message.error(error))
      search({
        ...params,
        offset,
        limit: 8
      }, ids => {
        if (ids.length === 0) {
          clear()
        } else {
          getList({
            id_list: ids.join(',')
          }, error => message.error(error))
        }
      }, error => message.error(error))
  }
  render() {
    const {list, loading, visible, okHandler, cancelHandler} = this.props
    const pagination = {
      total: this.state.total,
      showTotal: total => `共 ${total} 条`,
      defaultPageSize: 8,
      onChange: offset => this._search(offset)
    }
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
    }]
    const rowSelection = {
      selectedRowKeys: this.state.selectedList.map(i => i.id),
      onChange: (selectedRowKeys, selectedRows) => this.setState((prevState) => ({
        selectedList: prevState.selectedList.concat(selectedRows.map(item => {
          if (prevState.selectedList.find(x => x.id != item.id)) {
            return item
          }
        }))
      })),
      onSelect: (record, selected) => {
        let selectedList = this.state.selectedList
        if (selected) {
          selectedList = selectedList.concat(record)
        } else {
          selectedList = selectedList.filter(i => i.id != record.id)
        }
        this.setState({selectedList})
      }
    }
    return (
      <Modal visible={visible} onOk={() => okHandler(this.state.selectedList)} width='100%' onCancel={cancelHandler} title="选择试题" >
        <div style={{margin: '10px 0'}}>
          <Category onChange={this._changeHandler} style={{width: '520px'}}/>
        </div>
        <Table rowKey='id' bordered columns={columns} dataSource={list} loading={loading} pagination={pagination} rowSelection={rowSelection} />
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
  // userId: PropTypes.number.isRequired,
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
    clear() {
      dispatch({
        type: 'topic/list/clear'
      })
    },
    search(params, resolve, reject) {
      dispatch({
        type: 'topic/search',
        payload: {
          params, resolve, reject
        }
      })
    },
    searchInfo(params, resolve, reject) {
      dispatch({
        type: 'topic/search/info',
        payload: {
          params, resolve, reject
        }
      })
    },
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
