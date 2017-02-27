import React, {Component, PropTypes} from 'react';
import { Table, message, Upload, Button } from 'antd'
import { add, list, info }from '../../../services/source'
import { UPLOAD_FILE_API, IMAGE} from '../../../constants/api'

class ImageSelect extends Component {
    state = {
        loading: true,
        total: 0,
        list: [],
        selectedRowKey: []
    }
    componentWillMount() {
        info({state: 1, category_id: IMAGE}).then(data => this.setState({total: data.count}))
        this._getList(1)
    }
    _getList = offset => {
        list({
            state: 1,
            limit: 3,
            offset,
            category_id: IMAGE
        }).then(data => {
            this.setState({
                loading: false,
                list: data.list
            })
        }).catch(error => message.error(error))
    }
    changeHandler = info => {
        if (info.file.status === 'uploading' && this.state.loading === false) {
            this.setState({ loading: true })
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 200) {
                const params = { 
                    title: info.file.name.split('.')[0], 
                    category_id: IMAGE,
                    state: 1,
                    path: info.file.response.file
                }
                add(params).then((data) => {
                    this.setState({
                        list: [{ ...params, id: data.identity }].concat(this.state.list),
                        total: this.state.total + 1,
                        loading: false
                    })
                }).catch(error => {
                    message.error(error),
                    this.setState({ loading: false })
                })
            } else {
                this.setState({
                    loading: false
                })
                message.error(`文件上传出错: ${info.file.response.msg}`)
            }
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败!`)
            this.setState({ loading: false })
        }
    }
    render() {
        const { total, loading, list, selectedRowKey } = this.state
        const { onChange } = this.props
        const pagination = {
            showTotal: total => `共${total}条`,
            total: total,
            pageSize: 3,
            onChange: offset => this._getList(offset)
        }
        const columns = [{
            title: '图片',
            key: 'path',
            dataIndex: 'path',
            render: path => (<img src={path} width='100' height='80'/>)
        }, {
            title: '',
            key: 'title',
            dataIndex: 'title',
            render: (text, record) => (
                <div>
                    <p>{text}</p>
                    <p>{record.descript}</p>
                </div>
            )
        }]

        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRowKey,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKey: selectedRowKeys })
                onChange(selectedRows[0])
            }
        }
        return (
            <div>
                <Upload
                    name = 'upload_file'
                    action = {UPLOAD_FILE_API}
                    showUploadList = {false}
                    accept = 'image/jpeg, image/png'
                    onChange = {this.changeHandler}
                    beforeUpload = {file => {
                      const fiveM = 5*1024*1024
                      const isToobig = file.size > fiveM
                      if (isToobig) {
                          message.error('只允许上传不大于5M的图片!')
                      }
                      return !isToobig
                  }}
                >
                    <Button style={{ marginBottom: 10 }} type="primary">新增</Button>
                </Upload>
                <Table rowKey="id" dataSource={list} pagination={pagination} loading={loading} columns = {columns} rowSelection= {rowSelection} onRowClick={
                    (record) => {
                        this.setState({ selectedRowKey: [record.id] })
                        onChange(record)
                    }
                }/>
            </div>
        );
    }
}

ImageSelect.propTypes = {
    onChange: PropTypes.func.isRequired
};

export default ImageSelect
